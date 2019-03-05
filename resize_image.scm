
> (define (resize-image filename-in filename-out new-width new-height)
  (let* ((image    (car (gimp-file-load RUN-NONINTERACTIVE filename-in "")))
         (drawable (car (gimp-image-active-drawable image)))
        )

     (gimp-image-scale image new-width new-height)
     (gimp-file-save   RUN-NONINTERACTIVE image drawable filename-out "")
  )
)
resize-image
> (resize-image "D:/Documents/School/CSS/452/BalloonValhalla/maze_pixels.png" "D:/Documents/School/CSS/452/BalloonValhalla/maze_pixels2.png" 1024 1024)
(#t)