using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace image_gallery.Models
{
    public class Gallery
    {
        [Key]
        public int GalleryId { get; set; }
        public string GalleryUrl { get; set; }
        public string Title { get; set; }
        public ICollection<GalleryImage> GalleryImages { get; set; }

    }
}
