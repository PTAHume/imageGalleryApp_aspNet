using System;
using image_gallery.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel;
namespace image_gallery.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext>options):base(options)
        {
        }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }
    }
}

