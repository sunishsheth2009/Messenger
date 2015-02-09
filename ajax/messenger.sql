use messenger;

drop table if exists messages;
drop table if exists members;

create table members (
id int not null auto_increment,

login varchar (100),
register_at datetime,
scan_at datetime,

primary key (id)

);

create index index1 on members (id, scan_at);

create table messages (
id int not null auto_increment,

txt varchar (100),
from_id int not null, 
to_id int not null, 

read_at datetime,

primary key (id)

);

create index index1 on messages (from_id, to_id, read_at);
