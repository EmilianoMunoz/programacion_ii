package com.qturn.dto;

import java.sql.Date;

public record SignUpDto (String name, String surname, String email, String phone, String coverage, Date dob, String login, char[] password) { }