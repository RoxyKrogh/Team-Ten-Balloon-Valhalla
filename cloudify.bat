SET INF="D:/Documents/School/CSS/452/BalloonValhalla/maze_pixels.png"
SET OUTF="D:/Documents/School/CSS/452/BalloonValhalla/maze_pixels2.png"
SET OUTS=1024
PATH=%PATH%;"D:\Software\x64\GIMP 2\bin"
gimp-2.10 -idf --verbose --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import cloudify;batch.run('maze_pixels.png', 'maze_clouds.png')" -b "pdb.gimp_quit(1)"
@REM gimp-2.10 -i -b '(let* ((image (car (gimp-file-load RUN-NONINTERACTIVE %INF% ""))) (drawable (car (gimp-image-active-drawable image))) ) (gimp-image-scale image %OUTS% %OUTS%) (plug-in-colortoalpha RUN-NONINTERACTIVE image drawable '(0 0 0)) (plug-in-gauss RUN-NONINTERACTIVE image drawable 8 8 0) (plug-in-gauss RUN-NONINTERACTIVE image drawable 8 8 0) (gimp-selection-all image) (gimp-edit-paste drawable FALSE) (let* ((floatsel (car (gimp-edit-paste drawable FALSE)))) (plug-in-cubism RUN-NONINTERACTIVE image drawable 10 2.5 1) (gimp-floating-sel-anchor floatsel) ) (plug-in-cubism RUN-NONINTERACTIVE image drawable 10 2.5 1) (plug-in-gauss RUN-NONINTERACTIVE image drawable 8 8 0) (plug-in-gauss RUN-NONINTERACTIVE image drawable 8 8 0) (gimp-selection-all image) (gimp-edit-paste drawable FALSE) (let* ((floatsel (car (gimp-edit-paste drawable FALSE)))) (gimp-floating-sel-anchor floatsel) ) (gimp-file-save RUN-NONINTERACTIVE image drawable %OUTF% "")' -b '(gimp-quit 0)' %INF%
@REM "D:\Software\x64\GIMP 2\bin\gimp-console-2.8.exe" --batch-interpreter python-fu-eval 


