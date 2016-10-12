using System;

namespace ReactNetCoreBase.Models.Db {
    public abstract class Base : IAuditable {
        public string Author { get; set; }
        public int AuthorId { get; set; }
        public DateTime Created { get; set; }
        public string Editor { get; set; }
        public int EditorId { get; set; }
        public int Id { get; set; }
        public DateTime Modified { get; set; }
    }
}
