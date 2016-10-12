using System;

namespace ReactNetCoreBase.Models.Db {
    public interface IAuditable
    {
        DateTime Created { get; set; }

        DateTime Modified { get; set; }

        int AuthorId { get; set; }

        int EditorId { get; set; }

        string Author { get; set; }

        string Editor { get; set; }
    }
}
