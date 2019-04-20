package com.pinyougou.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.pinyougou.pojo.TbSeller;
import com.pinyougou.sellergoods.service.SellerService;

/**
 * 配置springsecurity配置类，配置xml文件通过这个类进行安全配置
 * 
 * @author lx
 *
 */
public class UserDetailsServiceImpl implements UserDetailsService {

	/**
	 *
	 *注入service的方法供这边的service使用
	 */
	private SellerService sellerService;

	public void setSellerService(SellerService sellerService) {
		this.sellerService = sellerService;
	}

	/**
	 * (non-Javadoc) 配置方法的拦截
	 * 
	 * @see org.springframework.security.core.userdetails.UserDetailsService#
	 * loadUserByUsername(java.lang.String)
	 */
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		System.out.println("通过了认证类拦截");
		List<GrantedAuthority> grantAuths = new ArrayList<GrantedAuthority>();
		grantAuths.add(new SimpleGrantedAuthority("ROLE_SELLER"));
		// 根据id取出这个用户，然后判断并取出密码，不用xml那种写死用户名和密码的方法
		TbSeller seller = sellerService.findOne(username);

		return new User(username, seller.getPassword(), grantAuths);
		/*
		 * if(seller!=null) { if(seller.getStatus().equals('1')) {
		 * System.out.println("测试用户是否通过"); return new
		 * User(username,"123456",grantAuths); }else { return null; } } else { return
		 * null; }
		 */
	}

}
