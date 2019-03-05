# This script is a gimp macro for automatically turning a 
# low-resolution maze image into a 1024x1024 cloud maze texture

def solidify_alpha(image, drawable, repetition_count):
	pdb.gimp_selection_all(image)
    copied = pdb.gimp_edit_copy_visible(image)
    for i in range(repetition_count):
        floating_sel = pdb.gimp_edit_paste(drawable, False)
	pdb.gimp_floating_sel_anchor(floating_sel)


def cloudify_maze(image, drawable):
	pdb.gimp_context_set_interpolation(0) # point filtering
	pdb.gimp_image_scale(image, 1024, 1024) # upscale image
	pdb.plug_in_gauss(image, drawable, 8, 8, 0) # blur
	pdb.plug_in_gauss(image, drawable, 8, 8, 0) # blur
	solidify_alpha(2) # copy/paste image, twice (sharpen edge blur)
	pdb.plug_in_cubism(image, drawable, 10, 2.5, 1) # add cloud puffiness
	pdb.plug_in_cubism(image, drawable, 10, 2.5, 1) # add cloud fluffiness
	pdb.plug_in_gauss(image, drawable, 8, 8, 0) # blur
	pdb.plug_in_gauss(image, drawable, 8, 8, 0) # blur
	solidify_alpha(2) # copy/paste image, twice (sharpen edge blur)


image = gimp.image_list()[0]
drawable = pdb.gimp_image_active_drawable(image)
cloudify_maze(image, drawable)
