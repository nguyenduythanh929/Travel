package com.tour.travel.Service.impl;


import com.tour.travel.Entity.PermissionEntity;
import com.tour.travel.Entity.RoleEntity;
import com.tour.travel.Entity.UserEntity;
import com.tour.travel.dto.user.MyUserDetail;
import com.tour.travel.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmailWithRolesAndPermissions(email, 1);
        if(user == null){
            throw new UsernameNotFoundException("Email not found");
        }
        Set<GrantedAuthority> authorities = new HashSet<>();
        if (user.getRoles() != null) {
            for(RoleEntity role: user.getRoles()){
                authorities.add(new SimpleGrantedAuthority("ROLE_"+role.getCode()));
                if (role.getPermissions() != null) {
                    for (PermissionEntity permission : role.getPermissions()) {
                        authorities.add(new SimpleGrantedAuthority(permission.getCode()));
                    }
                }
            }
        }
        MyUserDetail myUserDetail = new MyUserDetail(email,user.getPassword(),true,true,true,true,new ArrayList<>(authorities));
        BeanUtils.copyProperties(user, myUserDetail);
        myUserDetail.setFullName(user.getName());
        return myUserDetail;
    }
}
