#!/bin/bash

mazepixels=$(wslpath -a "$1")
echo "$(wslpath -w "$mazepixels")"
echo "Generating maze level from $mazepixels"
mkdir Level || rm Level/*
cp $mazepixels Level/maze_pixels.png

cp $mazepixels gimp_cloudify/maze_pixels.png
cd gimp_cloudify
cmd.exe /c .\\cloudify.bat $mazepixels
cd ../
mv gimp_cloudify/maze_clouds.png Level/maze_clouds.png

cp $mazepixels generate_normals/maze_pixels.png
cd generate_normals
cmd.exe /c .\\gennormals.bat
cd ../
mv generate_normals/maze_normals.png Level/maze_normals.png 

echo "Generated maze level"
