if not exists (select 1 from [Right])
begin
  insert into [Right] (id, name) values
  (1, 'Admin'),
  (2, 'Visitor')
end

if not exists (select 1 from [Role])
begin
  insert into [Role] (Name,[Description],Author,AuthorId,Editor,EditorId,Created,Modified)
  values
  ('Administrator', 'Default build-in administrator role','SYSTEM',1,'SYSTEM',1, sysdatetime(), sysdatetime());
    
  declare @roleId INT = scope_identity();

  insert into RoleRight(RoleId, [Right])
  select @roleId, Id from [Right]

  insert into [Role] (Name,[Description],Author,AuthorId,Editor,EditorId,Created,Modified)
  values
  ('Visitor', 'Visitor role','SYSTEM',1,'SYSTEM',1, sysdatetime(), sysdatetime());

  set @roleId = scope_identity();

  insert into RoleRight(RoleId, [Right]) Values (@roleId,2)
end