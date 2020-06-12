create table account (
  id text not null unique,
  token_id text not null,
  username text not null,
  allow_negative_balance boolean default false,
  created_at timestamptz not null default now(),
  balance numeric(18, 4) not null default 0 check ((allow_negative_balance = true) or (balance >= 0)),
  primary key (id, token_id)
);

create table transfer (
  id text not null unique,
  token_id text not null,
  created_at timestamptz not null default now(),
  from_account_id text not null references account(id),
  to_account_id text not null references account(id) check (from_account_id <> to_account_id),
  amount numeric(18, 4) not null check (amount > 0),
  internal_ref text,
  primary key (id, token_id)
);

create or replace function transfer_trigger() returns trigger as $$
begin
  update account
  set balance = balance - new.amount
  where id = new.from_account_id and token_id = new.token_id;

  update account
  set balance = balance + new.amount
  where id = new.to_account_id and token_id = new.token_id;

  return new;
end; $$ language plpgsql volatile;

create trigger transfer_trigger
after insert on transfer
for each row execute procedure transfer_trigger();

create table sideshift_order (
  id text primary key,
  created_at timestamptz not null default now(),
  account_id text not null references account(id),
  deposit_method_id text not null
);

create table sideshift_deposit (
  id text primary key,
  created_at timestamptz not null default now(),
  order_id text not null references sideshift_order(id),
  status text not null
);

--insert into account (id, tokenId, allow_negative_balance, username)
--select 'funding', true, '/funding';
