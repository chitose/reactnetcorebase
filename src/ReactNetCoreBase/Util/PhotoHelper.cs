using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ReactNetCoreBase.Util
{
  public static class PhotoHelper
  {
    private static readonly ImageCodecInfo jpegCodec = ImageCodecInfo.GetImageEncoders().FirstOrDefault(i => i.MimeType == "image/jpeg");

    private const string DEFAULT_PROFILE = "profiledefault.png";

    public static FileResult GetPhotoResponse(byte[] photo, string defaultImage = DEFAULT_PROFILE)
    {
      if (photo == null || photo.Length == 0)
      {
        return new VirtualFileResult($"/img/{defaultImage}", "image/png") { FileDownloadName = "photo.png" };
      }

      var codec = GetPhotoMimeType(photo);
      return new FileContentResult(photo, codec.MimeType) { FileDownloadName = $"photo.{codec.FilenameExtension.Split(';')[0].Split('.')[1]}" };
    }

    public static ImageCodecInfo GetPhotoMimeType(byte[] photo)
    {
      using (var ms = new MemoryStream(photo))
      {
        using (var img = Image.FromStream(ms))
        {
          ImageFormat format = img.RawFormat;
          ImageCodecInfo codec = ImageCodecInfo.GetImageDecoders().First(c => c.FormatID == format.Guid);
          return codec;
        }
      }
    }

    public static byte[] GetPhotoThumb(byte[] photo, int width)
    {
      if (photo == null)
      {
        var fileInfo = new FileInfo($"wwwroot/img/{DEFAULT_PROFILE}");
        if (fileInfo.Exists)
        {
          using (var fs = fileInfo.Open(FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
          {
            photo = new byte[fs.Length];
            fs.Read(photo, 0, photo.Length);
          }
        }
      }
      using (var os = new MemoryStream(photo))
      {
        var img = Image.FromStream(os);
        using (var ms = new MemoryStream())
        {
          double rat = (double)img.Width / (double)img.Height;
          int newHeight = (int)(width / rat);
          img = ScaleImage((Bitmap)img, width, newHeight);
          SaveTemporary(img, ms, 100);
          return ms.ToArray();
        }
      }
    }

    public static string GetPhotoAsDataURL(byte[] photo)
    {
      var codec = GetPhotoMimeType(photo);
      return string.Format("data:image/{0};base64;{1}", codec.MimeType, Convert.ToBase64String(photo));
    }

    private static Image ScaleImage(Bitmap image, int newWidth, int newHeight)
    {
      Bitmap result = new Bitmap(newWidth, newHeight, PixelFormat.Format24bppRgb);
      result.SetResolution(image.HorizontalResolution, image.VerticalResolution);

      using (Graphics g = Graphics.FromImage(result))
      {
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.CompositingQuality = CompositingQuality.HighQuality;
        g.SmoothingMode = SmoothingMode.HighQuality;
        g.PixelOffsetMode = PixelOffsetMode.HighQuality;

        g.DrawImage(image, 0, 0, result.Width, result.Height);
      }
      return result;
    }

    private static void SaveTemporary(Image bmp, MemoryStream ms, int quality)
    {
      EncoderParameter qualityParam = new EncoderParameter(Encoder.Quality, quality);
      var encoderParams = new EncoderParameters(1) { Param = { [0] = qualityParam } };
      bmp.Save(ms, jpegCodec, encoderParams);
    }
  }
}
