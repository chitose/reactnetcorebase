using System;
using System.Linq;
using System.Text.RegularExpressions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Models.Db;
using ReactNetCoreBase.Models.View;

namespace ReactNetCoreBase.Controllers {
  public class BaseApiController : Controller {
    protected readonly ApplicationDbContext db;
    protected readonly IMapper mapper;
    public BaseApiController(ApplicationDbContext db, IMapper mapper) {
      this.db = db;
      this.mapper = mapper;
    }        
  }
}
