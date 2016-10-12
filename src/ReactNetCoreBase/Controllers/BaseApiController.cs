using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;

namespace ReactNetCoreBase.Controllers {
    public class BaseApiController : Controller {
        protected readonly ApplicationDbContext db;
        public BaseApiController(ApplicationDbContext db) {
            this.db = db;
        }
    }
}
