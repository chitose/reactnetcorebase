if not exists (select 1 from [User])
begin
  declare @AdminRoleId INT;

  select @AdminRoleId = Id from [Role] Where [Name] = 'Administrator';

  declare @VisitorId INT;

  select @VisitorId = Id from [Role] Where [Name] = 'Visitor';

  insert into [User](UserName, PasswordHash, SecurityStamp, LockoutEnd, LockoutEnabled, AccessFailedCount, RoleId, Email, Phone, FirstName, LastName,  AuthorId, Author, Created, EditorId, Editor, Modified) values
  ('admin', 'AQAAAAEAACcQAAAAEOVZo0+7DAOqB2rVM46Y5HkPX4dbhYeUnQ/3jVcEgwpkFJLdGjPpkVsO9S9Bu5wlOQ==', 'SecurityStamp', NULL, 1, 0,
   @AdminRoleId, NULL, NULL, 'App', 'Administrator', 1, 'System', GETUTCDATE(),1, 'System', GETUTCDATE());

   insert into [User](UserName, PasswordHash, SecurityStamp, LockoutEnd, LockoutEnabled, AccessFailedCount, RoleId, Email, Phone, FirstName, LastName,  AuthorId, Author, Created, EditorId, Editor, Modified) values
  ('visitor', 'AQAAAAEAACcQAAAAEOVZo0+7DAOqB2rVM46Y5HkPX4dbhYeUnQ/3jVcEgwpkFJLdGjPpkVsO9S9Bu5wlOQ==', 'SecurityStamp', NULL, 1, 0,
   @VisitorId, 'visitor@gmail.com', NULL, 'App', 'Visitor', 1, 'System', GETUTCDATE(),1, 'System', GETUTCDATE())

end