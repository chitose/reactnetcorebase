using System;
using ReactNetCoreBase.Infrastructure.Attributes;

namespace ReactNetCoreBase.Models.Db
{
  public abstract class Base : IAuditable
  {
    [OptionalTypeScriptProperty]
    public string Author { get; set; }
    [OptionalTypeScriptProperty]
    public int AuthorId { get; set; }
    [OptionalTypeScriptProperty]
    public string Editor { get; set; }
    [OptionalTypeScriptProperty]
    public int EditorId { get; set; }
    public int Id { get; set; }
    [OptionalTypeScriptProperty]
    public DateTime Modified { get; set; }
    [OptionalTypeScriptProperty]
    public DateTime Created { get; set; }
    [OptionalTypeScriptProperty]
    public byte[] RowVersion { get; set; }
  }
}
