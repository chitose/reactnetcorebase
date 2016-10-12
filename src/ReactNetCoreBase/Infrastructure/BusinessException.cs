using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ReactNetCoreBase.Infrastructure {
    public class BusinessException : Exception {
        public BusinessException(string resource_key, object options = null) : 
            base(resource_key + (options != null ? $"|{JsonConvert.SerializeObject(options)}" : "")) {

        }
    }
}
