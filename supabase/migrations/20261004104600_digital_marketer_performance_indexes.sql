create index if not exists idx_campaigns_brand on public.campaigns(brand_id);
create index if not exists idx_content_business on public.content_items(business_id);
create index if not exists idx_content_brand on public.content_items(brand_id);
create index if not exists idx_content_product on public.content_items(product_id);
create index if not exists idx_knowledge_verified_by on public.knowledge_documents(verified_by);