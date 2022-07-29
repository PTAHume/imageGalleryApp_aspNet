using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using image_gallery.Data;
using image_gallery.Models;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace image_gallery.Controllers
{
    [Route("api/[controller]")]
    public class GalleryController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly IHostEnvironment _env;
        public GalleryController(ApplicationDbContext db, IHostEnvironment env)
        {
            _db = db;
            _env = env;
        }
        [HttpGet]
        public IActionResult GetImageGallery()
        {
            var result = _db.Galleries.ToList();
            return Ok(result.Select(t=>t.GalleryId));
        }
        [HttpGet("{id}")]
        public IActionResult GetImageGallery([FromRoute]int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = from g in _db.Galleries
                         join i in _db.GalleryImages.Where(t => t.GalleryId == id)
                         on g.GalleryId equals i.GalleryId
                         select new
                         {
                             Gallery_Id = g.GalleryId,
                             Gallery_Title = g.Title,
                             Gallery_Path = g.GalleryUrl,
                             Image_Id = i.ImageId,
                             Image_Path = i.ImageUrl,
                             Image_Caption = i.Caption
                         };
            if (result==null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> PostFormData(Gallery gallery, IFormCollection formdata)
        {
            string GalleryTitle = formdata["GalleryTitle"];
            gallery.GalleryUrl = "1111111";
            gallery.Title = "my gallery image";
            
            int id = await CreateGalleryID(gallery);
            int i = 0;
            string GalleryPath = Path.Combine(_env.ContentRootPath+$"{Path.DirectorySeparatorChar}Uploads{Path.DirectorySeparatorChar}Gallery{Path.DirectorySeparatorChar}",id.ToString());
            CreateDirectory(GalleryPath);
            foreach (var file in formdata.Files)
            {
                if (file.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName);
                    var filename = DateTime.Now.ToString("yymmssfff");
                    var path = Path.Combine(GalleryPath, filename) + extension;
                    //string ImageCaption = formdata["ImageCaption[]"][i];
                    string ImageCaption = $"image{i}";
                    GalleryImage Image = new GalleryImage();
                    Image.GalleryId = id;
                    Image.ImageUrl = path;
                    Image.Caption = ImageCaption;
                    await _db.GalleryImages.AddAsync(Image);
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    i = i + 1;
                }
            }
            gallery.Title = GalleryTitle;
            gallery.GalleryUrl = GalleryPath;
            _db.Galleries.Update(gallery);
            await _db.SaveChangesAsync();
            return new JsonResult("successfully added" + GalleryTitle);
        }
        private void CreateDirectory(string gallerypath)
        {
            if (!Directory.Exists(gallerypath))
            {
                Directory.CreateDirectory(gallerypath);
            }
        }
        private async Task<int> CreateGalleryID(Gallery gallery)
        {
            _db.Galleries.Add(gallery);
            await _db.SaveChangesAsync();
            await _db.Entry(gallery).GetDatabaseValuesAsync();
            int id = gallery.GalleryId;
            return id;
        }
    }
}

