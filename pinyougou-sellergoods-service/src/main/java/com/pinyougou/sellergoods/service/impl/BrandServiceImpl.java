package com.pinyougou.sellergoods.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbBrandExample;
import com.pinyougou.pojo.TbBrandExample.Criteria;
import com.pinyougou.sellergoods.service.BrandService;

import entity.PageResult;
@Service
@Transactional
public class BrandServiceImpl implements BrandService {
	@Autowired
	private TbBrandMapper brandMapper;
	@Override
	public List<TbBrand> findAll() {
		// TODO Auto-generated method stub
		return brandMapper.selectByExample(null);
	}
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		// TODO Auto-generated method stub
		PageHelper.startPage(pageNum, pageSize);
		Page<TbBrand> sg = (Page<TbBrand>) brandMapper.selectByExample(null);
		return new PageResult(sg.getTotal(), sg.getResult());
	}
	@Override
	public void add(TbBrand brand) {
		// TODO Auto-generated method stub
		brandMapper.insert(brand);
	}
	@Override
	public void update(TbBrand brand) {
		// TODO Auto-generated method stub
		//修改的保存服务设置
		brandMapper.updateByPrimaryKey(brand);
	}
	@Override
	public TbBrand findOne(long id) {
		// TODO Auto-generated method stub
		//根据id找用户
		return brandMapper.selectByPrimaryKey(id);
	}
	@Override
	public void delete(long[] ids) {
		// TODO Auto-generated method stub
		for(long id : ids) {
			brandMapper.deleteByPrimaryKey(id);
		}
	}
	@Override
	public PageResult findPage(TbBrand brand, int pageNum, int pageSize) {
		// TODO Auto-generated method stub
		//将参数设置到查询条件里面
		TbBrandExample example = new TbBrandExample();
		Criteria criteria = example.createCriteria();
		if(brand!=null) {
			if(brand.getName()!=null&&brand.getName().length()>0) {
				criteria.andNameLike("%"+brand.getName()+"%");
			}
			if(brand.getFirstChar()!=null&&brand.getFirstChar().length()>0) {
				criteria.andNameLike("%"+brand.getFirstChar()+"%");
			}
		}
		PageHelper.startPage(pageNum, pageSize);
		Page<TbBrand> sg = (Page<TbBrand>) brandMapper.selectByExample(example);
		return new PageResult(sg.getTotal(), sg.getResult());
	}
	@Override
    public List<Map> selectOptionList(){
		return brandMapper.selectOptionList();
	}
}
