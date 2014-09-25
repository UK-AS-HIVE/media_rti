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

  $RTI_type = intval($header[0]);
  list($image_width, $image_height, $color_dimensions) = array_map(function($i) { return intval($i); }, explode(' ', $header[1]));
  list($basis_terms, $basis_type, $element_size) = array_map(function($i) { return intval($i); }, explode(' ', $header[2]));

  // Reopen as binary for reading the data block
  $f = fopen($file, 'rb');

  fseek($f, $headersize);

  // Read scale and bias values
  $scale_values = unpack('f*', fread($f, 4*$basis_terms));
  $bias_values = unpack('f*', fread($f, 4*$basis_terms));



  print_r($scale_values);
  print_r($bias_values);

  $imagebuffer = array();
  for ($t = 0; $t < $basis_terms; ++$t) {
    $imagebuffer[] = imagecreatetruecolor($image_width, $image_height);
    $min[] = 255;
    $max[] = 0;
  }

  // Pass 1: find max and min values per coefficient layer
  for ($y = 0; $y < $image_height; ++$y) {
    for ($x = 0; $x < $image_width; ++$x) {
      if ($basis_type == 2) { 
        // RGB
        $pixel = array_fill(0, $basis_terms, array(0,0,0));
        for ($c = 0; $c < $color_dimensions; ++$c) {
          $pixel_data = fread($f, $element_size*$basis_terms);
          if ($element_size == 1) {
            $coefs = unpack('C*', $pixel_data);
            for ($b = 1; $b <= $basis_terms; ++$b) {
              $p = 128+127.0*( (($coefs[$b]- 128.0)*$scale_values[$b]/127.0)+$bias_values[$b] );
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
  fseek($f, $headersize + 2*4*$basis_terms);

  print_r("pass 2\n");

  // Pass 2: Read pixel data
  for ($y = 0; $y < $image_height; ++$y) {
    for ($x = 0; $x < $image_width; ++$x) {
      if ($basis_type == 2) {
        // RGB
        $pixel = array_fill(0, $basis_terms, array(0,0,0));
        for ($c = 0; $c < $color_dimensions; ++$c) {
          $pixel_data = fread($f, $element_size*$basis_terms);
          switch($element_size) {
            default:
            case 1:
              $coefs = unpack('C*', $pixel_data);
              for ($b = 1; $b <= $basis_terms; ++$b) {
                $p = 128+127.0*( (($coefs[$b]- 128.0)*$scale_values[$b]/127.0)+$bias_values[$b] );
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
        for ($b = 0; $b < $basis_terms; ++$b) {
          imagesetpixel($imagebuffer[$b], $x, $y, imagecolorallocate($imagebuffer[$b], $pixel[$b][0], $pixel[$b][1], $pixel[$b][2]));
          //imagesetpixel($imagebuffer[$b], $x, $y, imagecolorallocate($imagebuffer[$b], 128,128,128));
        }
      } elseif ($basis_type == 1) {
        // LRGB
        // TODO
      }
    }
  }

  print_r("writing to jpegs\n");

  // Squarify at a power of 2
  $major_dim = max($image_width, $image_height);
  $square_length = intval(pow(2,ceil(log($major_dim,2))));
  $square_image = imagecreatetruecolor(258, 258);

  for ($t = 0; $t < $basis_terms; ++$t) {
    imagecopyresampled($square_image, $imagebuffer[$t],
      258*($square_length - $image_width)/($square_length)/2, 
      258*($square_length - $image_height)/($square_length)/2,
      0, 0,
      258*($image_width/$square_length),
      258*($image_height/$square_length),
      $image_width, $image_height);
    imagejpeg($square_image, '/var/www/sites/default/files/rti/1224/1_' . ($t+1) . '.jpg', 90);
    imagedestroy($imagebuffer[$t]);
  }

  imagedestroy($square_image);

}

if (function_exists(drush_print)) {
  media_rti_unpack_rti_file(16686);
}

