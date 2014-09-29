<?php

function media_rti_unpack_rti_file($fid) {
  $file = drupal_realpath(file_load($fid)->uri);

  // Open in text mode for reading the header info
  $f = fopen($file, 'r');

  $headersize = 0;
  $header = array();
  for ($h = 0; $h<3; ++$h) {
    while ($l = stream_get_line($f, 256, "\r\n")) {
      $headersize += strlen($l)+2;
      if ($l[0] != '#')
        break;
    }
    $header[] = $l;
  }

  print_r($header);
  print_r('header size in bytes: ' . $headersize);

  fclose($f);

  $info = array();

  $info['RTI_type'] = intval($header[0]);
  list($info['image_width'], $info['image_height'], $info['color_dimensions']) = array_map(function($i) { return intval($i); }, explode(' ', $header[1]));
  list($info['basis_terms'], $info['basis_type'], $info['element_size']) = array_map(function($i) { return intval($i); }, explode(' ', $header[2]));

  // Reopen as binary for reading the data block
  $f = fopen($file, 'rb');

  fseek($f, $headersize);

  // Read scale and bias values
  $info['scale_values'] = unpack('f*', fread($f, 4*$info['basis_terms']));
  $info['bias_values'] = unpack('f*', fread($f, 4*$info['basis_terms']));



  print_r($info['scale_values']);
  print_r($info['bias_values']);

  $imagebuffer = array();
  for ($t = 0; $t < $info['basis_terms']; ++$t) {
    $imagebuffer[] = imagecreatetruecolor($info['image_width'], $info['image_height']);
    $min[] = 255;
    $max[] = 0;
  }

  // Pass 1: find max and min values per coefficient layer
  for ($y = 0; $y < $info['image_height']; ++$y) {
    for ($x = 0; $x < $info['image_width']; ++$x) {
      if ($info['basis_type'] == 2) { 
        // RGB
        $pixel = array_fill(0, $info['basis_terms'], array(0,0,0));
        for ($c = 0; $c < $info['color_dimensions']; ++$c) {
          $pixel_data = fread($f, $info['element_size']*$info['basis_terms']);
          if ($info['element_size'] == 1) {
            $coefs = unpack('C*', $pixel_data);
            for ($b = 1; $b <= $info['basis_terms']; ++$b) {
              $p = 128+127.0*( (($coefs[$b]- 128.0)*$info['scale_values'][$b]/127.0)+$info['bias_values'][$b] );
              //$p = 255.0*( ($coefs[$b]*$scale_values[$b]/255.0)+$bias_values[$b] );
              //$p = ( ($coefs[$b]*$scale_values[$b])+$bias_values[$b] )/255.0;
              if ($p < $min[$b-1])
                $min[$b-1] = $p;
              if ($p > $max[$b-1])
                $max[$b-1] = $p;
            }
          }
        }
      }
    }
  }

  // Reset to beginning of pixel data
  fseek($f, $headersize + 2*4*$info['basis_terms']);

  print_r("pass 2\n");

  // Pass 2: Read pixel data
  for ($y = 0; $y < $info['image_height']; ++$y) {
    for ($x = 0; $x < $info['image_width']; ++$x) {
      if ($info['basis_type'] == 2) {
        // RGB
        $pixel = array_fill(0, $info['basis_terms'], array(0,0,0));
        for ($c = 0; $c < $info['color_dimensions']; ++$c) {
          $pixel_data = fread($f, $info['element_size']*$info['basis_terms']);
          switch($info['element_size']) {
            default:
            case 1:
              $coefs = unpack('C*', $pixel_data);
              for ($b = 1; $b <= $info['basis_terms']; ++$b) {
                $p = 128+127.0*( (($coefs[$b]- 128.0)*$info['scale_values'][$b]/127.0)+$info['bias_values'][$b] );
                //$p = 255.0*( ($coefs[$b]*$scale_values[$b]/255.0)+$bias_values[$b] );
                //$p = ( ($coefs[$b]*$scale_values[$b])+$bias_values[$b] )/255.0;
                /*if ($p < $min[$b-1])
                  $min[$b-1] = $p;
                if ($p > $max[$b-1])
                  $max[$b-1] = $p;*/

                $pixel[$b-1][$c] = 255*($p-$min[$b-1])/($max[$b-1]-$min[$b-1]);
                //$pixel[$b-1][$c] = ($p<0)?0:(($p>255)?255:intval($p));
              }
              break;
            // TODO: support storage other than bytes
          }
        }
        for ($b = 0; $b < $info['basis_terms']; ++$b) {
          imagesetpixel($imagebuffer[$b], $x, $y, imagecolorallocate($imagebuffer[$b], $pixel[$b][0], $pixel[$b][1], $pixel[$b][2]));
          //imagesetpixel($imagebuffer[$b], $x, $y, imagecolorallocate($imagebuffer[$b], 128,128,128));
        }
      } elseif ($info['basis_type'] == 1) {
        // LRGB
        // TODO
      }
    }
  }

  print_r("writing to jpegs\n");

  // Squarify at a power of 2
  $major_dim = max($info['image_width'], $info['image_height']);
  $info['square_length'] = intval(pow(2,ceil(log($major_dim,2))));
  $square_image = imagecreatetruecolor(258, 258);

  $firstId = 0;
  media_rti_generate_tree(&$square_image, &$imagebuffer, $info, $firstId, -1, 0, 0, 1);

  /*for ($t = 0; $t < $basis_terms; ++$t) {
    imagecopyresampled($square_image, $imagebuffer[$t],
      258*($square_length - $image_width)/($square_length)/2, 
      258*($square_length - $image_height)/($square_length)/2,
      0, 0,
      258*($image_width/$square_length),
      258*($image_height/$square_length),
      $image_width, $image_height);
    imagejpeg($square_image, '/var/www/sites/default/files/rti/1224/1_' . ($t+1) . '.jpg', 90);
  }*/

  for ($t = 0; $t < $info['basis_terms']; ++$t) {
    imagedestroy($imagebuffer[$t]);
  }
  imagedestroy($square_image);

}

function media_rti_generate_tree(&$square_image, &$imagebuffer, &$info, &$id, $parentIndex, $x, $y, $s) {

  if ($s * $info['square_length'] < 256)
    return;

  $myId = ++$id;



  $oneSrcPixel = $s*$info['square_length']/256;
  $srcX = -$oneSrcPixel + $info['square_length'] * $x + ($info['image_width'] - $info['square_length']) / 2;
  $srcY = -$oneSrcPixel + $info['square_length'] * $y + ($info['image_height'] - $info['square_length']) / 2;
  $hs = $s*0.5;
  $w = 2*$oneSrcPixel + $s*($info['square_length']);

  print_r('id: ' . $myId . "\tsize: " . $w . "\t@ $srcX, $srcY\n");

  for ($t = 0; $t < $info['basis_terms']; ++$t) {
    imagecopyresampled(
      $square_image,
      $imagebuffer[$t],
      0, 0,
      $srcX, $srcY,
      258, 258,
      $w, $w);
    imagejpeg($square_image, '/var/www/sites/default/files/rti/1224/' . $myId . '_' . ($t+1) . '.jpg', 98);
  }

  media_rti_generate_tree($square_image, $imagebuffer, $info, $id, $myId, $x, $y+$hs, $hs);
  media_rti_generate_tree($square_image, $imagebuffer, $info, $id, $myId, $x+$hs, $y+$hs, $hs);
  media_rti_generate_tree($square_image, $imagebuffer, $info, $id, $myId, $x, $y, $hs);
  media_rti_generate_tree($square_image, $imagebuffer, $info, $id, $myId, $x+$hs, $y, $hs);


}

if (function_exists(drush_print)) {
  media_rti_unpack_rti_file(16686);
}

