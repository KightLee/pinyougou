package com.pinyougou.shop.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 显示登录名
 * @author lx
 *
 */
@RestController
@RequestMapping("/login")
public class LoginConroller {
	@RequestMapping("/name")
	public Map name() {
		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		Map map = new HashMap();
		map.put("loginName", name);
		return map;
	}
}
