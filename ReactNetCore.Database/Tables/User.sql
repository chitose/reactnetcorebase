CREATE TABLE [dbo].[User]
(
    [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [UserName] NVARCHAR(256) NOT NULL, 
    [FirstName] NVARCHAR(100) NOT NULL, 
    [LastName] NVARCHAR(100) NOT NULL, 
    [RoleId] INT NOT NULL, 
    [PasswordHash] NVARCHAR(100) NULL, 
    [SecurityStamp] NVARCHAR(40) NOT NULL DEFAULT 'Security Stamp', 
    [LockoutEnd] DATETIMEOFFSET(0) NULL, 
    [LockoutEnabled] BIT NOT NULL DEFAULT 0, 
    [AccessFailedCount] INT NULL DEFAULT 0, 
    [Author] NVARCHAR(256) NOT NULL, 
    [AuthorId] INT NOT NULL, 
    [Editor] NVARCHAR(256) NOT NULL, 
    [EditorId] INT NOT NULL, 
    [Modified] SMALLDATETIME NOT NULL, 
    [Created] SMALLDATETIME NOT NULL, 
    [Phone] NVARCHAR(30) NULL, 
    [Email] NVARCHAR(256) NULL, 
    [RowVersion] TIMESTAMP NOT NULL,
    [Image] VARBINARY(MAX) NULL, 
    CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleId]) REFERENCES [Role]([Id])
)

GO

CREATE UNIQUE INDEX [IX_User_UserName] ON [dbo].[User] ([UserName])

GO

CREATE UNIQUE INDEX [IX_User_Email] ON [dbo].[User] ([Email])
