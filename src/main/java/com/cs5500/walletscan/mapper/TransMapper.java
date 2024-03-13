package com.cs5500.walletscan.mapper;



import com.cs5500.walletscan.entity.Transaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TransMapper {
    //查询所有的用户信息
    @Select("select * from walletscan.transactions")
     List<Transaction> selUserMapper();
}