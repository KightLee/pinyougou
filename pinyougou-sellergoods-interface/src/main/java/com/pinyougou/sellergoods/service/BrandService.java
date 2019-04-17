package com.pinyougou.sellergoods.service;
/*
 * 品牌接口
 */

import java.util.List;
import java.util.Map;

import com.pinyougou.pojo.TbBrand;

import entity.PageResult;

public interface BrandService{
	public List<TbBrand> findAll();
	public PageResult findPage(int pageNum,int pageSize);
	public void add(TbBrand brand);
	public void update(TbBrand brand);
	public TbBrand findOne(long id);
	public void delete(long[] ids);
	public PageResult findPage(TbBrand brand,int pageNum,int pageSize);
	public List<Map> selectOptionList();
}
