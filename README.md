rti-webview
===========

This is a viewer for RTI files.

All the code is taken from [here] (http://vcg.isti.cnr.it/~palma/dokuwiki/doku.php?id=research)

[Direct link to code] (http://vcg.isti.cnr.it/~palma/webRTIViewer.zip)

To run the windows commandline exe needed for RTI conversion use wine

Install wine on Ubuntu:
-----------------------

    sudo add-apt-repository ppa:ubuntu-wine/ppa
    sudo apt-get update
    sudo apt-get install wine1.7
    
Run rti converter on Ubuntu:
----------------------------

    wine webGLRTIMaker.exe <input RTI file path> <quality of jpg (1 to 100)>
    
This will create a folder in the same directory as the input file. The folder will have the same name as the rti file without the extension.

Example:

    $ ls rti
    cuniform.rti
    $ wine webGLRtiMaker.exe rti/cuniform.rti 90
    $ ls rti
    cuniform  cuniform.rti
    $ ls rti/cuniform
    1_1.jpg  1_7.jpg  2_4.jpg  3_1.jpg  3_7.jpg  4_4.jpg  5_1.jpg  5_7.jpg
    1_2.jpg  1_8.jpg  2_5.jpg  3_2.jpg  3_8.jpg  4_5.jpg  5_2.jpg  5_8.jpg
    1_3.jpg  1_9.jpg  2_6.jpg  3_3.jpg  3_9.jpg  4_6.jpg  5_3.jpg  5_9.jpg
    1_4.jpg  2_1.jpg  2_7.jpg  3_4.jpg  4_1.jpg  4_7.jpg  5_4.jpg  info.xml
    1_5.jpg  2_2.jpg  2_8.jpg  3_5.jpg  4_2.jpg  4_8.jpg  5_5.jpg
    1_6.jpg  2_3.jpg  2_9.jpg  3_6.jpg  4_3.jpg  4_9.jpg  5_6.jpg
