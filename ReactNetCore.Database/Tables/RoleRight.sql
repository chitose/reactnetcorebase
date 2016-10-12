CREATE TABLE [dbo].[RoleRight]
(
    [Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [RoleId] INT NOT NULL, 
    [Right] INT NOT NULL, 
    CONSTRAINT [FK_RoleRight_Right] FOREIGN KEY ([Right]) REFERENCES [Right]([Id]), 
    CONSTRAINT [FK_RoleRight_Role] FOREIGN KEY ([RoleId]) REFERENCES [Role]([Id])
)
