using System;
using System.ComponentModel.DataAnnotations;
namespace image_gallery.Models
{
    public class GalleryImage
    {
        [Key]
        public int ImageId { get; set; }
        public string ImageUrl { get; set; }
        public string Caption { get; set; }
        public int GalleryId { get; set; }
        public Gallery Gallery { get; set; }
    }
}

