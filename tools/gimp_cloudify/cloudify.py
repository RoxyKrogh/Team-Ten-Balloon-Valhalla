#!/usr/bin/python
# gimp -idf --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import cloudify;batch.run('maze_pixels.png', 'maze_clouds.png')" -b "pdb.gimp_quit(1)"

import os,sys,time
from gimpfu import *

clear_color = (0, 0, 0)
out_size = 1024
blur_radius = 8
blur_repetitions = 3
copy_repetitions = 1
puff_size = 8
puff_variation = 3


def merge_selection(floating_selection):
    pdb.gimp_floating_sel_anchor(floating_selection)


def solidify_alpha(image, drawable, repetition_count):
    pdb.gimp_selection_all(image)
    copied = pdb.gimp_edit_copy_visible(image)
    for i in range(repetition_count):
        floating_sel = pdb.gimp_edit_paste(drawable, False)
    return floating_sel


def blur(image, drawable, repetition_count):
    for i in range(repetition_count):
        pdb.plug_in_gauss(image, drawable, blur_radius, blur_radius, 0) # blur


def cloudify_maze(image, drawable):
    pdb.gimp_image_select_color(image, 2, drawable, (255,255,255)) # select all white pixels
    pdb.gimp_selection_invert(image) # invert the selection
    pdb.gimp_edit_clear(drawable) # delete the selected pixels
    pdb.gimp_selection_none(image) # clear the selection (select nothing)
    pdb.plug_in_colortoalpha(image, drawable, clear_color) # make black pixels transparent
    pdb.gimp_context_set_interpolation(0) # point filtering
    pdb.gimp_image_scale(image, out_size, out_size) # upscale image
    blur(image, drawable, blur_repetitions) # apply blur filter 1+ times
    float_sel = solidify_alpha(image, drawable, copy_repetitions) # copy/paste image, twice (sharpen edge blur)
    pdb.plug_in_cubism(image, drawable, puff_size, puff_variation, 1) # add cloud puffiness
    merge_selection(float_sel) # merge the pasted "floating" layer with the image
    pdb.plug_in_cubism(image, drawable, puff_size, puff_variation, 1) # add cloud fluffiness
    blur(image, drawable, blur_repetitions) # apply blur filer 1+ times
    float_sel = solidify_alpha(image, drawable, copy_repetitions) # copy/paste image, twice (sharpen edge blur)
    merge_selection(float_sel) # merge the pasted "floating" layer with the image


def run(in_file, out_file):
    start=time.time()
    print("Cloudifying image \"%s\"" % in_file)
    image = pdb.gimp_file_load(in_file, '')
    drawable = pdb.gimp_image_active_drawable(image)
    print("File %s loaded OK" % in_file)
    
    cloudify_maze(image, drawable)
    
    print("Saving to %s" % out_file)
    pdb.gimp_file_save(image, drawable, out_file, '')
    print("Saved to %s" % out_file)
    pdb.gimp_image_delete(image)
    end=time.time()
    print("Finished, total processing time: %.2f seconds" % (end-start))


if __name__ == "__main__":
    print("Running as __main__ with args: %s" % sys.argv)
