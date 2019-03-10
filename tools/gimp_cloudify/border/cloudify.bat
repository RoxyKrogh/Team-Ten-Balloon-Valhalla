SET INF="maze_pixels.png"
SET OUTF="maze_clouds.png"
@PATH=%PATH%;"C:\Program Files\GIMP 2\bin";"D:\Software\x64\GIMP 2\bin"
gimp-2.10 -idf --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import cloudify as myscript;myscript.run('%INF%', '%OUTF%');" -b "pdb.gimp_quit(True)"
