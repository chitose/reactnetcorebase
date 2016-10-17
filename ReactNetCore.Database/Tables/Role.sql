CREATE TABLE [dbo].[Role]
(
    [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Name] NVARCHAR(100) NOT NULL, 
    [Description] NVARCHAR(MAX) NULL,
    [Author] NVARCHAR(256) NOT NULL, 
    [AuthorId] INT NOT NULL, 
    [Editor] NVARCHAR(256) NOT NULL, 
    [EditorId] INT NOT NULL, 
    [Modified] SMALLDATETIME NOT NULL, 
    [Created] SMALLDATETIME NOT NULL,
    [RowVersion] TIMESTAMP NOT NULL
)
