using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ReactNetCoreBase.Models.Db;
using ReactNetCoreBase.Models.View;

namespace ReactNetCoreBase.Models.Map {
  public class MapConfigurationProfile : Profile {
    public MapConfigurationProfile() : base() {
    }

    [Obsolete]
    protected override void Configure() {
      base.Configure();

      CreateMap<User, LoginResponse>()
        .ForMember(dest => dest.CsrfToken, opt => opt.MapFrom(src => src.SecurityStamp))
        .ForMember(dest => dest.Rights, opt => opt.ResolveUsing((s, d, t) => {
          return s.Role.Rights.Select(r => r.Right);
        }))
        .ForMember(dest => dest.HasImage, opt => opt.ResolveUsing((s, d, t) => {
          return s.Image != null;
        }));

      CreateMap<ProfileUpdateRequest, User>()
      .ForMember(x => x.Image, opt => opt.ResolveUsing((p, u, b) => {
        return p.Image == null || p.Image.Length > 0 ? p.Image : u.Image;
      }));
    }
  }
}
