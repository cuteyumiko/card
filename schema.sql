CREATE SCHEMA bank;

CREATE TABLE bank.bank_agentpay ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	pass_code            varchar(100)    ,
	pass_config          longtext    ,
	code                 varchar(100)    ,
	is_enabled           tinyint  NOT NULL DEFAULT 0 ,
	CONSTRAINT pk_bank_sms_1 PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_bank ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	icon                 longtext    ,
	code                 varchar(100)    ,
	start_color          varchar(100)    ,
	end_color            varchar(100)    ,
	CONSTRAINT pk_bank_merchant_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_merchant_creator_id_0 ON bank.bank_bank ( creator_id );

CREATE TABLE bank.bank_bindcard ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	pass_code            varchar(100)    ,
	pass_config          longtext    ,
	code                 varchar(100)    ,
	CONSTRAINT pk_bank_sms_3 PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_cash_order ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	loan_id              int    ,
	mobile               varchar(100)    ,
	status               int  NOT NULL DEFAULT 1 ,
	money                decimal(10,2)    ,
	bank_name            varchar(100)    ,
	bank_card_no         varchar(100)    ,
	bank_card_name       varchar(100)    ,
	close_time           timestamp    ,
	code                 varchar(100)    ,
	comments             longtext    ,
	cash_fee             decimal(10,2)    ,
	CONSTRAINT pk_bank_product_loan_order_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_loan_order_creator_id_0 ON bank.bank_cash_order ( creator_id );

CREATE INDEX idx_bank_product_loan_order_loan_id_0 ON bank.bank_cash_order ( loan_id );

CREATE TABLE bank.bank_course_type ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)    ,
	icon                 longtext    ,
	CONSTRAINT pk_bank_news_id_1 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_1 ON bank.bank_course_type ( creator_id );

CREATE TABLE bank.bank_logs ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	merchant_id          int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	CONSTRAINT pk_bank_news_id_5 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_5 ON bank.bank_logs ( merchant_id );

CREATE TABLE bank.bank_merchant ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	host                 varchar(100)    ,
	company_name         varchar(100)    ,
	company_telephone    varchar(100)    ,
	max_cash_day         int    ,
	min_cash_order       int    ,
	cash_fee             int    ,
	agreement            longtext    ,
	wx_appid             varchar(100)    ,
	wx_secret            varchar(100)    ,
	agentpay_id          int    ,
	bindcard_id          int    ,
	CONSTRAINT pk_bank_merchant_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_merchant_creator_id ON bank.bank_merchant ( creator_id );

CREATE INDEX idx_bank_merchant_bindcard_id ON bank.bank_merchant ( bindcard_id );

CREATE TABLE bank.bank_merchant_article_type ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)    ,
	icon                 longtext    ,
	CONSTRAINT pk_bank_user_level_id_1 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_user_level_creator_id_1 ON bank.bank_merchant_article_type ( creator_id );

CREATE TABLE bank.bank_merchant_bill_type ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)    ,
	icon                 longtext    ,
	CONSTRAINT pk_bank_user_level_id_2 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_user_level_creator_id_3 ON bank.bank_merchant_bill_type ( creator_id );

CREATE TABLE bank.bank_merchant_extend ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)    ,
	type_id              int    ,
	CONSTRAINT pk_bank_sms_4 PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_merchant_notice_type ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	code                 varchar(100)    ,
	CONSTRAINT pk_bank_article_type_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_article_type_creator_id_0 ON bank.bank_merchant_notice_type ( creator_id );

CREATE TABLE bank.bank_merchant_x_extend ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	extend_id            int  NOT NULL  ,
	value                longtext    ,
	CONSTRAINT pk_bank_merchant_x_product_card_source_1 PRIMARY KEY ( merchant_id, extend_id )
 );

CREATE INDEX idx_bank_merchant_x_product_card_source_merchant_id_1 ON bank.bank_merchant_x_extend ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_source_source_id_1 ON bank.bank_merchant_x_extend ( extend_id );

CREATE TABLE bank.bank_payment ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	pass_code            varchar(100)    ,
	pass_config          longtext    ,
	code                 varchar(100)    ,
	used_weixin          tinyint  NOT NULL DEFAULT 0 ,
	used_mobile_browser  tinyint  NOT NULL DEFAULT 0 ,
	description          varchar(100)    ,
	return_url           varchar(100)    ,
	notify_url           varchar(100)    ,
	used_app             tinyint  NOT NULL DEFAULT 0 ,
	icon                 longtext    ,
	CONSTRAINT pk_bank_sms_0 PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_product_card_property ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)  NOT NULL  ,
	type_id              int  NOT NULL  ,
	CONSTRAINT pk_bank_product_ticket_type_3 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_ticket_type_creator_id_3 ON bank.bank_product_card_property ( creator_id );

CREATE TABLE bank.bank_product_card_source ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	description          longtext    ,
	icon                 longtext    ,
	image_description    longtext    ,
	is_enabled           tinyint    ,
	money                decimal(10,2)    ,
	is_recommend         tinyint  NOT NULL DEFAULT 0 ,
	CONSTRAINT pk_bank_product_ticket_type_1 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_ticket_type_creator_id_1 ON bank.bank_product_card_source ( creator_id );

CREATE TABLE bank.bank_product_loan_property ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)  NOT NULL  ,
	type_id              int  NOT NULL  ,
	CONSTRAINT pk_bank_product_ticket_type_4 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_ticket_type_creator_id_4 ON bank.bank_product_loan_property ( creator_id );

CREATE TABLE bank.bank_product_ticket_process ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	pass_code            varchar(100)    ,
	pass_config          longtext    ,
	code                 varchar(100)    ,
	CONSTRAINT pk_bank_sms_2 PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_product_ticket_property ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)  NOT NULL  ,
	type_id              int  NOT NULL  ,
	CONSTRAINT pk_bank_product_ticket_type_5 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_ticket_type_creator_id_5 ON bank.bank_product_ticket_property ( creator_id );

CREATE TABLE bank.bank_product_ticket_source ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	description          longtext    ,
	icon                 longtext    ,
	image_description    longtext    ,
	is_enabled           tinyint    ,
	is_home              tinyint  NOT NULL DEFAULT 0 ,
	CONSTRAINT pk_bank_product_ticket_type_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_ticket_type_creator_id_0 ON bank.bank_product_ticket_source ( creator_id );

CREATE TABLE bank.bank_product_ticket_source_property ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)  NOT NULL  ,
	type_id              int  NOT NULL  ,
	CONSTRAINT pk_bank_product_ticket_type_2 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_ticket_type_creator_id_2 ON bank.bank_product_ticket_source_property ( creator_id );

CREATE TABLE bank.bank_product_ticket_source_x_property ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	source_id            int  NOT NULL  ,
	property_id          int  NOT NULL  ,
	value                longtext    ,
	CONSTRAINT pk_bank_product_ticket_source_x_property PRIMARY KEY ( source_id, property_id )
 );

CREATE INDEX idx_bank_product_ticket_source_x_property_source_id ON bank.bank_product_ticket_source_x_property ( source_id );

CREATE INDEX idx_bank_product_ticket_source_x_property_property_id ON bank.bank_product_ticket_source_x_property ( property_id );

CREATE TABLE bank.bank_recharge_order ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	status               int  NOT NULL DEFAULT 1 ,
	code                 varchar(100)    ,
	money                decimal(10,2)    ,
	payment_id           int    ,
	payment_time         timestamp    ,
	CONSTRAINT pk_bank_product_card_order_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_card_order_creator_id_0 ON bank.bank_recharge_order ( creator_id );

CREATE TABLE bank.bank_sms ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	pass_code            varchar(100)    ,
	pass_config          longtext    ,
	code                 varchar(100)    ,
	CONSTRAINT pk_bank_sms PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_sms_code ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	mobile               varchar(100)    ,
	code                 varchar(100)    ,
	CONSTRAINT pk_bank_sms_code PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_system_log ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)    ,
	level_id             int  NOT NULL  ,
	content              longtext    ,
	CONSTRAINT pk_bank_system_log PRIMARY KEY ( id )
 );

CREATE TABLE bank.bank_user_x_user_level ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	user_id              int  NOT NULL  ,
	level_id             int  NOT NULL  ,
	up_count             int    ,
	CONSTRAINT pk_bank_product_card_x_price_2 PRIMARY KEY ( user_id, level_id )
 );

CREATE INDEX idx_bank_product_card_price_card_id_2 ON bank.bank_user_x_user_level ( user_id );

CREATE INDEX idx_bank_product_card_x_price_x_level_levle_id_2 ON bank.bank_user_x_user_level ( level_id );

CREATE TABLE bank.bank_weixin_access_token ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	merchant_id          int    ,
	name                 varchar(100)    ,
	appid                varchar(100)    ,
	expires_time         timestamp    ,
	access_token         varchar(1024)    ,
	CONSTRAINT pk_bank_news_id_6 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_6 ON bank.bank_weixin_access_token ( merchant_id );

CREATE TABLE bank.bank_weixin_jsapi_ticket ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	merchant_id          int    ,
	name                 varchar(100)    ,
	jsapi_ticket         varchar(1024)    ,
	expires_time         timestamp    ,
	access_token         varchar(1024)    ,
	CONSTRAINT pk_bank_news_id_7 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_7 ON bank.bank_weixin_jsapi_ticket ( merchant_id );

CREATE TABLE bank.bank_merchant_article ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	icon                 longtext    ,
	merchant_id          int    ,
	type_id              int    ,
	sort                 int  NOT NULL DEFAULT 0 ,
	attachment_list      longtext    ,
	download_count       int  NOT NULL DEFAULT 0 ,
	CONSTRAINT pk_bank_user_level_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_user_level_creator_id_0 ON bank.bank_merchant_article ( creator_id );

CREATE INDEX idx_bank_user_level_merchant_id_0 ON bank.bank_merchant_article ( merchant_id );

CREATE INDEX idx_bank_merchant_article_type_id ON bank.bank_merchant_article ( type_id );

CREATE TABLE bank.bank_merchant_bill ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	image                longtext    ,
	qr_rect              varchar(100)    ,
	merchant_id          int    ,
	text_color           varchar(100)    ,
	sort                 int  NOT NULL DEFAULT 0 ,
	type_id              int    ,
	CONSTRAINT pk_bank_merchant_bill PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_merchant_article_type_id_0 ON bank.bank_merchant_bill ( text_color );

CREATE INDEX idx_bank_user_level_creator_id_2 ON bank.bank_merchant_bill ( creator_id );

CREATE INDEX idx_bank_user_level_merchant_id_1 ON bank.bank_merchant_bill ( merchant_id );

CREATE INDEX idx_bank_merchant_bill_type_id ON bank.bank_merchant_bill ( type_id );

CREATE TABLE bank.bank_merchant_notice ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	file_list            longtext    ,
	is_enabled           tinyint    ,
	type_id              int    ,
	icon                 longtext    ,
	CONSTRAINT pk_bank_news_id_4 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_4 ON bank.bank_merchant_notice ( creator_id );

CREATE INDEX idx_bank_merchant_notice_type_id ON bank.bank_merchant_notice ( type_id );

CREATE TABLE bank.bank_merchant_x_product_card_source ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	source_id            int  NOT NULL  ,
	money                decimal(10,2)    ,
	CONSTRAINT pk_bank_merchant_x_product_card_source PRIMARY KEY ( merchant_id, source_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_merchant_x_product_card_source_merchant_id ON bank.bank_merchant_x_product_card_source ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_source_source_id ON bank.bank_merchant_x_product_card_source ( source_id );

CREATE TABLE bank.bank_merchant_x_sms ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	sms_id               int  NOT NULL  ,
	money                decimal(10,2)    ,
	pass_code            varchar(100)    ,
	pass_config          longtext    ,
	CONSTRAINT pk_bank_merchant_x_product_card_source_0 PRIMARY KEY ( merchant_id, sms_id )
 );

CREATE INDEX idx_bank_merchant_x_product_card_source_merchant_id_0 ON bank.bank_merchant_x_sms ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_source_source_id_0 ON bank.bank_merchant_x_sms ( sms_id );

CREATE TABLE bank.bank_article ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	thumbnail            longtext    ,
	file_list            longtext    ,
	type_id              int    ,
	sort                 int   DEFAULT 0 ,
	icon                 longtext    ,
	CONSTRAINT pk_bank_tutorial_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_article_creator_id ON bank.bank_article ( creator_id );

CREATE INDEX idx_bank_article_type_id ON bank.bank_article ( type_id );

CREATE TABLE bank.bank_article_type ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	code                 varchar(100)    ,
	CONSTRAINT pk_bank_article_type_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_article_type_creator_id ON bank.bank_article_type ( creator_id );

CREATE TABLE bank.bank_copy_library ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	file_list            longtext    ,
	is_enabled           tinyint    ,
	download_count       int    ,
	CONSTRAINT pk_bank_news_id_2 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_2 ON bank.bank_copy_library ( creator_id );

CREATE TABLE bank.bank_course ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	type_id              int    ,
	content              longtext    ,
	vip_content          longtext    ,
	icon                 longtext    ,
	view_count           int  NOT NULL DEFAULT 0 ,
	href                 longtext    ,
	CONSTRAINT pk_bank_news_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_0 ON bank.bank_course ( creator_id );

CREATE INDEX idx_bank_knowledge_type_id ON bank.bank_course ( type_id );

CREATE TABLE bank.bank_merchant_x_copy_library ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	copy_library_id      int  NOT NULL  ,
	CONSTRAINT pk_bank_merchant_x_product_card_2 PRIMARY KEY ( merchant_id, copy_library_id )
 );

CREATE INDEX idx_bank_merchant_x_product_card_merchant_id_2 ON bank.bank_merchant_x_copy_library ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_card_id_2 ON bank.bank_merchant_x_copy_library ( copy_library_id );

CREATE TABLE bank.bank_merchant_x_course ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	course_id            int  NOT NULL  ,
	CONSTRAINT pk_bank_merchant_x_product_card_3 PRIMARY KEY ( merchant_id, course_id )
 );

CREATE INDEX idx_bank_merchant_x_product_card_merchant_id_3 ON bank.bank_merchant_x_course ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_card_id_3 ON bank.bank_merchant_x_course ( course_id );

CREATE TABLE bank.bank_merchant_x_product_card ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	card_id              int  NOT NULL  ,
	money                decimal(10,2)    ,
	href                 longtext    ,
	apply_bg             longtext    ,
	CONSTRAINT pk_bank_merchant_x_product_card PRIMARY KEY ( merchant_id, card_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_merchant_x_product_card_merchant_id ON bank.bank_merchant_x_product_card ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_card_id ON bank.bank_merchant_x_product_card ( card_id );

CREATE TABLE bank.bank_merchant_x_product_loan ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	loan_id              int  NOT NULL  ,
	money                decimal(10,2)    ,
	href                 longtext    ,
	CONSTRAINT pk_bank_merchant_x_product_card_0 PRIMARY KEY ( merchant_id, loan_id )
 );

CREATE INDEX idx_bank_merchant_x_product_card_merchant_id_0 ON bank.bank_merchant_x_product_loan ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_card_id_0 ON bank.bank_merchant_x_product_loan ( loan_id );

CREATE TABLE bank.bank_merchant_x_product_ticket ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	merchant_id          int  NOT NULL  ,
	ticket_id            int  NOT NULL  ,
	money                decimal(10,2)    ,
	CONSTRAINT pk_bank_merchant_x_product_card_1 PRIMARY KEY ( merchant_id, ticket_id )
 );

CREATE INDEX idx_bank_merchant_x_product_card_merchant_id_1 ON bank.bank_merchant_x_product_ticket ( merchant_id );

CREATE INDEX idx_bank_merchant_x_product_card_card_id_1 ON bank.bank_merchant_x_product_ticket ( ticket_id );

CREATE TABLE bank.bank_news ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	content              longtext    ,
	CONSTRAINT pk_bank_news_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_news_creator_id ON bank.bank_news ( creator_id );

CREATE TABLE bank.bank_product_card ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	is_recommend         tinyint  NOT NULL DEFAULT 0 ,
	description          varchar(100)    ,
	got_count            int  NOT NULL DEFAULT 0 ,
	icon                 longtext    ,
	href                 longtext    ,
	recommend_bg         longtext    ,
	qr_rect              varchar(100)    ,
	money                decimal(10,2)    ,
	text_color           varchar(100)    ,
	apply_bg             longtext    ,
	icon2                longtext    ,
	sort                 int  NOT NULL DEFAULT 0 ,
	source_id            int    ,
	code                 varchar(100)    ,
	tip_text             varchar(250)    ,
	CONSTRAINT pk_bank_product_card_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_card_creator_id ON bank.bank_product_card ( creator_id );

CREATE INDEX idx_bank_product_card_source_id ON bank.bank_product_card ( source_id );

CREATE TABLE bank.bank_product_card_income ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	user_id              int  NOT NULL  ,
	order_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	comments             longtext    ,
	lower_id             int    ,
	CONSTRAINT pk_bank_product_card_income PRIMARY KEY ( user_id, order_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_card_income_user_id ON bank.bank_product_card_income ( user_id );

CREATE INDEX idx_bank_product_card_income_order_id ON bank.bank_product_card_income ( order_id );

CREATE INDEX idx_bank_product_card_income_lower_id ON bank.bank_product_card_income ( lower_id );

CREATE TABLE bank.bank_product_card_order ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	card_id              int    ,
	name                 varchar(100)    ,
	idno                 varchar(100)    ,
	mobile               varchar(100)    ,
	status               int    ,
	code                 varchar(100)    ,
	merchant_income      decimal(10,2)    ,
	platform_income      decimal(10,2)    ,
	status_reason        longtext    ,
	CONSTRAINT pk_bank_product_card_order_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_card_order_creator_id ON bank.bank_product_card_order ( creator_id );

CREATE INDEX idx_bank_product_card_order_card_id ON bank.bank_product_card_order ( card_id );

CREATE TABLE bank.bank_product_card_type ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	icon                 longtext    ,
	code                 varchar(100)    ,
	CONSTRAINT pk_bank_product_card_type_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_card_type_creator_id ON bank.bank_product_card_type ( creator_id );

CREATE TABLE bank.bank_product_card_x_property ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	card_id              int  NOT NULL  ,
	property_id          int  NOT NULL  ,
	value                longtext    ,
	CONSTRAINT pk_bank_product_ticket_source_x_property_0 PRIMARY KEY ( card_id, property_id )
 );

CREATE INDEX idx_bank_product_ticket_source_x_property_source_id_0 ON bank.bank_product_card_x_property ( card_id );

CREATE INDEX idx_bank_product_ticket_source_x_property_property_id_0 ON bank.bank_product_card_x_property ( property_id );

CREATE TABLE bank.bank_product_card_x_type ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	card_id              int  NOT NULL  ,
	type_id              int  NOT NULL  ,
	CONSTRAINT pk_bank_product_card_x_type PRIMARY KEY ( card_id, type_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_card_x_type_card_id ON bank.bank_product_card_x_type ( card_id );

CREATE INDEX idx_bank_product_card_x_type_type_id ON bank.bank_product_card_x_type ( type_id );

CREATE TABLE bank.bank_product_loan ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	icon                 longtext    ,
	quota                varchar(100)    ,
	interest             varchar(100)    ,
	description          varchar(100)    ,
	got_count            int   DEFAULT 0 ,
	is_recommend         tinyint   DEFAULT 0 ,
	href                 longtext    ,
	recommend_bg         longtext    ,
	qr_rect              varchar(100)    ,
	money                decimal(10,2)    ,
	money_unit           varchar(100)    ,
	text_color           varchar(100)    ,
	apply_bg             longtext    ,
	sort                 int  NOT NULL DEFAULT 0 ,
	is_enabled           tinyint    ,
	tip_text             varchar(250)    ,
	CONSTRAINT pk_bank_product_loan_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_loan_creator_id ON bank.bank_product_loan ( creator_id );

CREATE TABLE bank.bank_product_loan_income ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	user_id              int  NOT NULL  ,
	order_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	comments             longtext    ,
	lower_id             int    ,
	CONSTRAINT pk_bank_product_loan_income PRIMARY KEY ( user_id, order_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_loan_income_user_id ON bank.bank_product_loan_income ( user_id );

CREATE INDEX idx_bank_product_loan_income_order_id ON bank.bank_product_loan_income ( order_id );

CREATE INDEX idx_bank_product_loan_income_lower_id ON bank.bank_product_loan_income ( lower_id );

CREATE TABLE bank.bank_product_loan_order ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	loan_id              int    ,
	name                 varchar(100)    ,
	idno                 varchar(100)    ,
	mobile               varchar(100)    ,
	status               int    ,
	money                decimal(10,2)    ,
	code                 varchar(100)    ,
	merchant_income      decimal(10,2)    ,
	platform_income      decimal(10,2)    ,
	CONSTRAINT pk_bank_product_loan_order_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_loan_order_creator_id ON bank.bank_product_loan_order ( creator_id );

CREATE INDEX idx_bank_product_loan_order_loan_id ON bank.bank_product_loan_order ( loan_id );

CREATE TABLE bank.bank_product_loan_type ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	icon                 longtext    ,
	code                 varchar(100)    ,
	catagory_id          int    ,
	parent_id            int    ,
	color                varchar(100)    ,
	CONSTRAINT pk_bank_product_loan_type_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_loan_type_creator_id ON bank.bank_product_loan_type ( creator_id );

CREATE TABLE bank.bank_product_loan_x_property ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	loan_id              int  NOT NULL  ,
	property_id          int  NOT NULL  ,
	value                longtext    ,
	CONSTRAINT pk_bank_product_ticket_source_x_property_1 PRIMARY KEY ( loan_id, property_id )
 );

CREATE INDEX idx_bank_product_ticket_source_x_property_source_id_1 ON bank.bank_product_loan_x_property ( loan_id );

CREATE INDEX idx_bank_product_ticket_source_x_property_property_id_1 ON bank.bank_product_loan_x_property ( property_id );

CREATE TABLE bank.bank_product_loan_x_type ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	loan_id              int  NOT NULL  ,
	type_id              int  NOT NULL  ,
	CONSTRAINT pk_bank_product_loan_x_type PRIMARY KEY ( loan_id, type_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_loan_x_type_loan_id ON bank.bank_product_loan_x_type ( loan_id );

CREATE INDEX idx_bank_product_loan_x_type_type_id ON bank.bank_product_loan_x_type ( type_id );

CREATE TABLE bank.bank_product_ticket ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	points               varchar(100)    ,
	source_id            int    ,
	is_enabled           tinyint    ,
	money                decimal(10,2)    ,
	got_count            int   DEFAULT 0 ,
	process_id           int    ,
	settle_type          int    ,
	ticket_number_title  varchar(100)    ,
	ticket_password_title varchar(100)    ,
	CONSTRAINT pk_bank_product_ticket_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_ticket_creator_id ON bank.bank_product_ticket ( creator_id );

CREATE INDEX idx_bank_product_ticket_bank_id ON bank.bank_product_ticket ( source_id );

CREATE INDEX idx_bank_product_ticket_process_id ON bank.bank_product_ticket ( process_id );

CREATE TABLE bank.bank_product_ticket_income ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	user_id              int  NOT NULL  ,
	order_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	comments             longtext    ,
	lower_id             int    ,
	CONSTRAINT pk_bank_product_ticket_income PRIMARY KEY ( user_id, order_id )
 );

CREATE INDEX idx_bank_product_loan_income_user_id_0 ON bank.bank_product_ticket_income ( user_id );

CREATE INDEX idx_bank_product_loan_income_order_id_0 ON bank.bank_product_ticket_income ( order_id );

CREATE INDEX idx_bank_product_ticket_income_lower_id ON bank.bank_product_ticket_income ( lower_id );

CREATE TABLE bank.bank_product_ticket_order ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	ticket_number        varchar(100)    ,
	ticket_password      varchar(100)    ,
	comments             longtext    ,
	ticket_id            int    ,
	image                longtext    ,
	status               int    ,
	code                 varchar(100)    ,
	merchant_income      decimal(10,2)    ,
	platform_income      decimal(10,2)    ,
	CONSTRAINT pk_bank_product_ticket_order_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_product_ticket_order_creator_id ON bank.bank_product_ticket_order ( creator_id );

CREATE INDEX idx_bank_product_ticket_order_ticket_id ON bank.bank_product_ticket_order ( ticket_id );

CREATE TABLE bank.bank_product_ticket_x_property ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	ticket_id            int  NOT NULL  ,
	property_id          int  NOT NULL  ,
	value                longtext    ,
	CONSTRAINT pk_bank_product_ticket_source_x_property_2 PRIMARY KEY ( ticket_id, property_id )
 );

CREATE INDEX idx_bank_product_ticket_source_x_property_source_id_2 ON bank.bank_product_ticket_x_property ( ticket_id );

CREATE INDEX idx_bank_product_ticket_source_x_property_property_id_2 ON bank.bank_product_ticket_x_property ( property_id );

CREATE TABLE bank.bank_qr_spread ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	image                longtext    ,
	qr_rect              varchar(100)    ,
	is_enabled           tinyint    ,
	text_color           varchar(100)    ,
	CONSTRAINT pk_bank_news_id_3 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_news_creator_id_3 ON bank.bank_qr_spread ( creator_id );

CREATE TABLE bank.bank_user ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	username             varchar(100)    ,
	mobile               varchar(100)    ,
	password             varchar(100)    ,
	merchant_id          int    ,
	level_id             int    ,
	referee_id           int    ,
	name                 varchar(100)    ,
	user_type            int    ,
	status               int  NOT NULL DEFAULT 1 ,
	nickname             varchar(100)    ,
	weixin               varchar(100)    ,
	weixin_qr            longtext    ,
	head_image           longtext    ,
	cost_referee_count   int  NOT NULL DEFAULT 0 ,
	add_income           int  NOT NULL DEFAULT 0 ,
	add_team_count       int  NOT NULL DEFAULT 0 ,
	agentpay_id          int    ,
	invite_card_current  int  NOT NULL DEFAULT 0 ,
	invite_card_cost     int  NOT NULL DEFAULT 0 ,
	invite_card_target   int  NOT NULL DEFAULT 0 ,
	is_disabled          tinyint    ,
	disabled_reason      longtext    ,
	is_cash_disabled     tinyint  NOT NULL DEFAULT 0 ,
	shop_message         text    ,
	CONSTRAINT pk_bank_user_id PRIMARY KEY ( id ),
	CONSTRAINT uni_mobile__merchant_id UNIQUE ( merchant_id, mobile ) 
 ) engine=InnoDB;

CREATE INDEX idx_bank_user_merchant_id ON bank.bank_user ( merchant_id );

CREATE INDEX idx_bank_user_level_id ON bank.bank_user ( level_id );

CREATE INDEX idx_bank_user_parent_id ON bank.bank_user ( referee_id );

CREATE INDEX idx_bank_user_creator_id ON bank.bank_user ( creator_id );

CREATE TABLE bank.bank_user_balance ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	user_id              int    ,
	current_value        decimal(10,2)    ,
	change_value         decimal(10,2)    ,
	comments             longtext    ,
	card_order_id        int    ,
	loan_order_id        int    ,
	ticket_order_id      int    ,
	level_order_id       int    ,
	freeze_value         decimal(10,2)    ,
	cash_order_id        int    ,
	lower_id             int    ,
	remark               varchar(100)    ,
	CONSTRAINT pk_bank_user_balance_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_user_balance_user_id ON bank.bank_user_balance ( user_id );

CREATE INDEX idx_bank_user_balance_card_order_id ON bank.bank_user_balance ( card_order_id );

CREATE INDEX idx_bank_user_balance_loan_order_id ON bank.bank_user_balance ( loan_order_id );

CREATE INDEX idx_bank_user_balance_ticket_order_id ON bank.bank_user_balance ( ticket_order_id );

CREATE INDEX idx_bank_user_balance_level_order_id ON bank.bank_user_balance ( level_order_id );

CREATE INDEX idx_bank_user_balance_cash_order_id ON bank.bank_user_balance ( cash_order_id );

CREATE INDEX idx_bank_user_balance_lower_id ON bank.bank_user_balance ( lower_id );

CREATE TABLE bank.bank_user_bank_card ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	bank_card_name       varchar(100)    ,
	bank_card_no         varchar(100)  NOT NULL DEFAULT 0 ,
	mobile               varchar(100)    ,
	idno                 varchar(100)    ,
	bank_id              int    ,
	code                 varchar(100)    ,
	status               int    ,
	CONSTRAINT pk_bank_product_card_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_card_creator_id_0 ON bank.bank_user_bank_card ( creator_id );

CREATE INDEX idx_bank_user_bank_card_bank_id ON bank.bank_user_bank_card ( bank_id );

CREATE TABLE bank.bank_user_level ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	name                 varchar(100)    ,
	code                 varchar(100)    ,
	content              longtext    ,
	icon                 longtext    ,
	value                int    ,
	merchant_id          int    ,
	money                decimal(10,2)    ,
	income_money         decimal(10,2)    ,
	referee_count        int    ,
	card_bg              longtext    ,
	level_up_info        tinytext    ,
	info                 longtext    ,
	is_hidden            tinyint    ,
	disable_recommend    tinyint    ,
	award_card_count     int  NOT NULL DEFAULT 0 ,
	app_card_bg          longtext    ,
	CONSTRAINT pk_bank_user_level_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_user_level_creator_id ON bank.bank_user_level ( creator_id );

CREATE INDEX idx_bank_user_level_merchant_id ON bank.bank_user_level ( merchant_id );

CREATE TABLE bank.bank_user_level_income ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	user_id              int  NOT NULL  ,
	order_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	comments             longtext    ,
	lower_id             int    ,
	CONSTRAINT pk_bank_product_ticket_income_0 PRIMARY KEY ( user_id, order_id )
 );

CREATE INDEX idx_bank_product_loan_income_user_id_1 ON bank.bank_user_level_income ( user_id );

CREATE INDEX idx_bank_product_loan_income_order_id_1 ON bank.bank_user_level_income ( order_id );

CREATE INDEX idx_bank_user_level_income_lower_id ON bank.bank_user_level_income ( lower_id );

CREATE TABLE bank.bank_user_level_order ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	update_time          timestamp    ,
	update_ip            varchar(100)    ,
	creator_id           int    ,
	from_level_id        int    ,
	to_level_id          int    ,
	money                decimal(10,2)    ,
	status               int    ,
	code                 varchar(100)    ,
	merchant_income      decimal(10,2)    ,
	payment_id           int    ,
	platform_income      decimal(10,2)    ,
	CONSTRAINT pk_bank_product_ticket_order_id_0 PRIMARY KEY ( id )
 );

CREATE INDEX idx_bank_product_ticket_order_creator_id_0 ON bank.bank_user_level_order ( creator_id );

CREATE INDEX idx_bank_user_level_order_from_level_id ON bank.bank_user_level_order ( from_level_id );

CREATE INDEX idx_bank_user_level_order_to_level_id ON bank.bank_user_level_order ( to_level_id );

CREATE TABLE bank.bank_user_level_x_product_card ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	card_id              int  NOT NULL  ,
	level_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	CONSTRAINT pk_bank_product_card_x_price PRIMARY KEY ( card_id, level_id )
 );

CREATE INDEX idx_bank_product_card_price_card_id ON bank.bank_user_level_x_product_card ( card_id );

CREATE INDEX idx_bank_product_card_x_price_x_level_levle_id ON bank.bank_user_level_x_product_card ( level_id );

CREATE TABLE bank.bank_user_level_x_product_card_source ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	source_id            int  NOT NULL  ,
	level_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	CONSTRAINT pk_bank_user_level_x_product_card_source PRIMARY KEY ( source_id, level_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_user_level_x_product_card_source_source_id ON bank.bank_user_level_x_product_card_source ( source_id );

CREATE INDEX idx_bank_user_level_x_product_card_source_level_id ON bank.bank_user_level_x_product_card_source ( level_id );

CREATE TABLE bank.bank_user_level_x_product_loan ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	loan_id              int  NOT NULL  ,
	level_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	percent              decimal(10,2)    ,
	CONSTRAINT pk_bank_product_card_x_price_0 PRIMARY KEY ( loan_id, level_id )
 );

CREATE INDEX idx_bank_product_card_price_card_id_0 ON bank.bank_user_level_x_product_loan ( loan_id );

CREATE INDEX idx_bank_product_card_x_price_x_level_levle_id_0 ON bank.bank_user_level_x_product_loan ( level_id );

CREATE TABLE bank.bank_user_level_x_product_ticket ( 
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	ticket_id            int  NOT NULL  ,
	level_id             int  NOT NULL  ,
	money                decimal(10,2)    ,
	CONSTRAINT pk_bank_product_card_x_price_1 PRIMARY KEY ( ticket_id, level_id )
 );

CREATE INDEX idx_bank_product_card_price_card_id_1 ON bank.bank_user_level_x_product_ticket ( ticket_id );

CREATE INDEX idx_bank_product_card_x_price_x_level_levle_id_1 ON bank.bank_user_level_x_product_ticket ( level_id );

CREATE TABLE bank.bank_user_referee ( 
	user_id              int  NOT NULL  ,
	referee_id           int  NOT NULL  ,
	value                int  NOT NULL  ,
	CONSTRAINT pk_bank_user_referee PRIMARY KEY ( user_id, referee_id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_user_referee_user_id ON bank.bank_user_referee ( user_id );

CREATE INDEX idx_bank_user_referee_referee_id ON bank.bank_user_referee ( referee_id );

CREATE TABLE bank.bank_user_token ( 
	id                   int  NOT NULL  AUTO_INCREMENT,
	create_time          timestamp   DEFAULT CURRENT_TIMESTAMP ,
	create_ip            varchar(100)    ,
	cancel_time          timestamp    ,
	cancel_ip            varchar(100)    ,
	user_id              int    ,
	token                varchar(100)    ,
	user_agent           longtext    ,
	CONSTRAINT pk_bank_user_token_id PRIMARY KEY ( id )
 ) engine=InnoDB;

CREATE INDEX idx_bank_user_token_user_id ON bank.bank_user_token ( user_id );

CREATE PROCEDURE bank.clean_merchant ( IN mid INT )
BEGIN
  if mid is null then
    select '请输入商户id';
  else
    delete from bank_user_balance where user_id in ( select id from bank_user where merchant_id = 5);
    delete from bank_product_card_order where creator_id in ( select id from bank_user where merchant_id = 5);
    delete from bank_product_loan_order where creator_id in ( select id from bank_user where merchant_id = 5);
    delete from bank_product_ticket_order where creator_id in ( select id from bank_user where merchant_id = 5);
    delete from bank_user_level_order where creator_id in ( select id from bank_user where merchant_id = 5);
    delete from bank_cash_order where creator_id in ( select id from bank_user where merchant_id = 5);
  end if;
END

CREATE VIEW bank.v__bank_user_referee AS select
  a.id as current_id,
  r0.id as referee_0_id, r0.name as referee_0_name, r0.mobile as referee_0_mobile,
  r1.id as referee_1_id,
  r2.id as referee_2_id,
  r3.id as referee_3_id,
  r4.id as referee_4_id,
  r5.id as referee_5_id,
  r6.id as referee_6_id,
  r7.id as referee_7_id,
  r8.id as referee_8_id,
  r9.id as referee_9_id,
  r10.id as referee_10_id,
  r11.id as referee_11_id,
  r12.id as referee_12_id,
  r13.id as referee_13_id,
  r14.id as referee_14_id,
  r15.id as referee_15_id,
  r16.id as referee_16_id,
  r17.id as referee_17_id,
  r18.id as referee_18_id,
  r19.id as referee_19_id,
  r20.id as referee_20_id
from bank_user a
left join bank_user r0 on r0.id = a.referee_id
left join bank_user r1 on r1.id = r0.referee_id
left join bank_user r2 on r2.id = r1.referee_id
left join bank_user r3 on r3.id = r2.referee_id
left join bank_user r4 on r4.id = r3.referee_id
left join bank_user r5 on r5.id = r4.referee_id
left join bank_user r6 on r6.id = r5.referee_id
left join bank_user r7 on r7.id = r6.referee_id
left join bank_user r8 on r8.id = r7.referee_id
left join bank_user r9 on r9.id = r8.referee_id
left join bank_user r10 on r10.id = r9.referee_id
left join bank_user r11 on r11.id = r10.referee_id
left join bank_user r12 on r12.id = r11.referee_id
left join bank_user r13 on r13.id = r12.referee_id
left join bank_user r14 on r14.id = r13.referee_id
left join bank_user r15 on r15.id = r14.referee_id
left join bank_user r16 on r16.id = r15.referee_id
left join bank_user r17 on r17.id = r16.referee_id
left join bank_user r18 on r18.id = r17.referee_id
left join bank_user r19 on r19.id = r18.referee_id
left join bank_user r20 on r20.id = r19.referee_id;

CREATE VIEW bank.v__merchant_by_copy_library AS select a.copy_library_id,
  group_concat(concat('[',b.id,']')) as xs_merchant_id,
  group_concat(b.id) as x_merchant_id,
  group_concat(b.name) as x_merchant_name
from bank_merchant_x_copy_library a left join bank_merchant b on b.id = a.merchant_id
group by a.copy_library_id;

CREATE VIEW bank.v__merchant_by_course AS select a.course_id,
  group_concat(concat('[',b.id,']')) as xs_merchant_id,
  group_concat(b.id) as x_merchant_id,
  group_concat(b.name) as x_merchant_name
from bank_merchant_x_course a left join bank_merchant b on b.id = a.merchant_id
group by a.course_id;

CREATE VIEW bank.v__type_by_product_card AS select card_id,
  group_concat(concat('[',b.id,']')) as type_ids,
  group_concat(concat('[',b.code,']')) as type_code
from bank_product_card_x_type a
left join bank_product_card_type b on b.id = a.type_id
group by a.card_id;

CREATE VIEW bank.v__type_by_product_loan AS select loan_id,
  group_concat(concat('[',b.id,']')) as type_ids,
  group_concat(concat('[',b.code,']')) as type_code
from bank_product_loan_x_type a
left join bank_product_loan_type b on b.id = a.type_id
group by a.loan_id;

CREATE VIEW bank.v_bank_article AS select `a`.`id` AS `id`,`a`.`create_time` AS `create_time`,`a`.`create_ip` AS `create_ip`,`a`.`update_time` AS `update_time`,`a`.`update_ip` AS `update_ip`,`a`.`creator_id` AS `creator_id`,`a`.`name` AS `name`,`a`.`content` AS `content`,`a`.`thumbnail` AS `thumbnail`,`a`.`file_list` AS `file_list`,`a`.`type_id` AS `type_id`,`a`.`sort` AS `sort`,`a`.`icon` AS `icon`,`b`.`name` AS `type_name`,`b`.`code` AS `type_code` from (`bank`.`bank_article` `a` left join `bank`.`bank_article_type` `b` on((`b`.`id` = `a`.`type_id`)));

CREATE VIEW bank.v_bank_cash_order AS select
  a.*, a.creator_id as user_id,
  b.name as creator_name, b.mobile as creator_mobile, b.merchant_id,
  c.name as merchant_name
from bank_cash_order a
left join bank_user b on b.id = a.creator_id
left join bank_merchant c on c.id = b.merchant_id;

CREATE VIEW bank.v_bank_copy_library AS select a.*,
  b.xs_merchant_id, b.x_merchant_id, b.x_merchant_name
from bank_copy_library a
left join v__merchant_by_copy_library b on b.copy_library_id = a.id;

CREATE VIEW bank.v_bank_course AS select a.*,
  b.name as type_name,
  c.xs_merchant_id, c.x_merchant_id, c.x_merchant_name
from bank_course a
left join bank_course_type b on b.id = a.type_id
left join v__merchant_by_course c on c.course_id = a.id;

CREATE VIEW bank.v_bank_merchant_article AS select a.*,
  b.name as type_name, b.code as type_code,
  c.name as merchant_name
from bank_merchant_article a
left join bank_merchant_article_type b on b.id = a.type_id
left join bank_merchant c on c.id = a.merchant_id;

CREATE VIEW bank.v_bank_merchant_bill AS select a.*,
  b.name AS merchant_name,
  c.name as type_name, c.code as type_code
from bank_merchant_bill a
left join bank_merchant b on b.id = a.merchant_id
left join bank_merchant_bill_type c on c.id = a.type_id;

CREATE VIEW bank.v_bank_merchant_notice AS select
  a.*,
  b.name as type_name, b.code as type_code,
  c.merchant_id
from bank_merchant_notice a
left join bank_merchant_notice_type b on b.id = a.type_id
left join bank_user c on c.id = a.creator_id;

CREATE VIEW bank.v_bank_product_card AS select
  a.*, b.type_ids,b.type_code,
  c.name as source_name, c.money as source_money, c.is_recommend as source_is_recommend, c.is_enabled as source_is_enabled
from bank_product_card a
left join v__type_by_product_card b on b.card_id = a.id
left join bank_product_card_source c on c.id = a.source_id;

CREATE VIEW bank.v_bank_product_card_order AS select
  a.*, date_format(a.create_time, '%Y-%m') stage_time,
  b.name as product_name, b.is_recommend as product_is_recommend, b.source_id,
  c.name as creator_name, c.mobile as creator_mobile, c.merchant_id,
  d.name as merchant_name,
  (select sum(money) from bank_product_card_income where order_id = a.id) as user_income
from bank_product_card_order a
left join bank_product_card b on b.id = a.card_id
left join bank_user c on c.id = a.creator_id
left join bank_merchant d on d.id = c.merchant_id;

CREATE VIEW bank.v_bank_product_card_order_income AS select a.*, concat(a.order_id, ':', a.user_id) as id,
  b.status, b.name as order_name, b.mobile as order_mobile, b.code as order_code,
  c.name as product_name,
  d.head_image as lower_head_image, d.name as lower_name, d.mobile as lower_mobile,
  e.name as lower_level_name,
  f.mobile as user_mobile,
  g.name as product_source_name
from bank_product_card_income a
left join bank_product_card_order b on b.id = a.order_id
left join bank_product_card c on c.id = b.card_id
left join bank_user d on d.id = a.lower_id
left join bank_user_level e on e.id = d.level_id
left join bank_user f on f.id = a.user_id
left join bank_product_card_source g on g.id = c.source_id
left join bank_merchant_x_product_card_source h on h.source_id = g.id and h.merchant_id = f.merchant_id;

CREATE VIEW bank.v_bank_product_card_with_merchant AS select
  a.*,
  b.is_recommend as source_is_recommend, b.is_enabled as source_is_enabled,
  c.merchant_id,  c.money as merchant_money,
  d.href as merchant_href, d.apply_bg as merchant_apply_bg,
  e.type_ids,e.type_code,
  (select max(x_a.money) from bank_user_level_x_product_card_source x_a left join bank_user_level x_b on x_b.id = x_a.level_id where x_b.merchant_id = c.merchant_id and x_a.source_id = a.source_id) as max_level_money
from bank_product_card a
left join bank_product_card_source b on b.id = a.source_id
join bank_merchant_x_product_card_source c on c.source_id = a.source_id
left join bank_merchant_x_product_card d on d.card_id = a.id and c.merchant_id =d.merchant_id
left join v__type_by_product_card e on e.card_id = a.id;

CREATE VIEW bank.v_bank_product_card_x_property AS select a.*,
  b.code as property_code
from bank_product_card_x_property a
left join bank_product_card_property b on b.id = a.property_id;

CREATE VIEW bank.v_bank_product_loan AS select
  a.*, b.type_ids, b.type_code
from bank_product_loan a
left join v__type_by_product_loan b on b.loan_id = a.id;

CREATE VIEW bank.v_bank_product_loan_order AS select
  a.id, a.create_time, a.creator_id, a.loan_id, a.name, a.idno, a.mobile, a.status, a.code, a.money as money,
  ifnull(a.money * a.merchant_income / 100, a.merchant_income) as merchant_income,
  ifnull(a.money * a.platform_income / 100, a.platform_income) as platform_income,
  date_format(a.create_time, '%Y-%m') stage_time,
  b.name as product_name, b.money_unit as product_money_unit, b.is_recommend as product_is_recommend,
  c.name as creator_name, c.mobile as creator_mobile, c.merchant_id,
  d.name as merchant_name,
  (select ifnull(a.money * sum(money) / 100, sum(money)) from bank_product_loan_income where order_id = a.id) as user_income
from bank_product_loan_order a
left join bank_product_loan b on b.id = a.loan_id
left join bank_user c on c.id = a.creator_id
left join bank_merchant d on d.id = c.merchant_id;

CREATE VIEW bank.v_bank_product_loan_order_income AS select a.*, concat(a.order_id, ':', a.user_id) as id,
  b.status, b.name as order_name, b.mobile as order_mobile, b.money as order_money, b.code as order_code,
  c.name as product_name, c.money_unit,
  d.head_image as lower_head_image, d.name as lower_name, d.mobile as lower_mobile,
  e.name as lower_level_name,
  f.mobile as user_mobile
from bank_product_loan_income a
left join bank_product_loan_order b on b.id = a.order_id
left join bank_product_loan c on c.id = b.loan_id
left join bank_user d on d.id = a.lower_id
left join bank_user_level e on e.id = d.level_id
left join bank_user f on f.id = a.user_id;

CREATE VIEW bank.v_bank_product_loan_type AS select a.*,
  b.name AS parent_name
from bank_product_loan_type a
left join bank_product_loan_type b on b.id = a.parent_id;

CREATE VIEW bank.v_bank_product_loan_with_merchant AS select
  a.*,
  b.merchant_id, b.money as merchant_money, b.href as merchant_href,
  c.type_ids, c.type_code,
  (select max(x_a.money) from bank_user_level_x_product_loan x_a left join bank_user_level x_b on x_b.id = x_a.level_id where x_b.merchant_id = b.merchant_id and x_a.loan_id = a.id) as max_level_money
from bank_product_loan a
join bank_merchant_x_product_loan b on b.loan_id = a.id
left join v__type_by_product_loan c on c.loan_id = a.id;

CREATE VIEW bank.v_bank_product_loan_x_property AS select a.*,
  b.code as property_code
from bank_product_loan_x_property a
left join bank_product_loan_property b on b.id = a.property_id;

CREATE VIEW bank.v_bank_product_ticket AS select
  a.*, b.name as source_name, b.icon as source_icon, a.id as dump_id,
  d.name as merchant_name,
  e.name as process_name
from bank_product_ticket a
left join bank_product_ticket_source b on b.id = a.source_id
left join bank_user c on c.id = a.creator_id
left join bank_merchant d on d.id = c.merchant_id
left join bank_product_ticket_process e on e.id = a.process_id;

CREATE VIEW bank.v_bank_product_ticket_order AS select
  a.*, date_format(a.create_time, '%Y-%m') stage_time,
  b.name as product_name,
  c.name as creator_name, c.mobile as creator_mobile, c.merchant_id,
  d.name as merchant_name,
  (select sum(money) from bank_product_ticket_income where order_id = a.id) as user_income,
  e.name as product_source_name
from bank_product_ticket_order a
left join bank_product_ticket b on b.id = a.ticket_id
left join bank_user c on c.id = a.creator_id
left join bank_merchant d on d.id = c.merchant_id
left join bank_product_ticket_source e on e.id = b.source_id;

CREATE VIEW bank.v_bank_product_ticket_order_income AS select a.*, concat(a.order_id, ':', a.user_id) as id,
  b.status, b.code as order_code, b.image as order_image, b.comments as order_comments, b.ticket_number, b.ticket_password,
  c.name as order_name, c.mobile as order_mobile,
  d.head_image as lower_head_image, d.name as lower_name, d.mobile as lower_mobile,
  e.name as lower_level_name,
  f.name as product_name,
  g.mobile as user_mobile
from bank_product_ticket_income a
left join bank_product_ticket_order b on b.id = a.order_id
left join bank_user c on c.id = b.creator_id
left join bank_user d on d.id = a.lower_id
left join bank_user_level e on e.id = d.level_id
left join bank_product_ticket f on f.id = b.ticket_id
left join bank_user g on g.id = a.user_id;

CREATE VIEW bank.v_bank_product_ticket_source_x_property AS select a.*,
  b.code as property_code
from bank_product_ticket_source_x_property a
left join bank_product_ticket_source_property b on b.id = a.property_id;

CREATE VIEW bank.v_bank_product_ticket_with_merchant AS select
  a.*,
  b.merchant_id, b.money as merchant_money, b.href as merchant_href,
  (select max(x_a.money) from bank_user_level_x_product_ticket x_a left join bank_user_level x_b on x_b.id = x_a.level_id where x_b.merchant_id = b.merchant_id and x_a.ticket_id = a.id) as max_level_money
from bank_product_ticket a
join bank_merchant_x_product_loan b on b.loan_id = a.id;

CREATE VIEW bank.v_bank_product_ticket_x_property AS select a.*,
  b.code as property_code
from bank_product_ticket_x_property a
left join bank_product_ticket_property b on b.id = a.property_id;

CREATE VIEW bank.v_bank_recharge_order AS select a.*,
  b.name as creator_name, b.mobile as creator_mobile,
  c.id as merchant_id, c.name as merchant_name,
  d.name as payment_name
from bank_recharge_order a
left join bank_user b on b.id = a.creator_id
left join bank_merchant c on c.id = b.merchant_id
left join bank_payment d on d.id = a.payment_id;

CREATE VIEW bank.v_bank_system_log AS select a.*,
  b.mobile as creator_mobile, b.name as creator_name,
  c.id as merchant_id, c.name as merchant_name
from bank_system_log a
left join bank_user b on b.id = a.creator_id
left join bank_merchant c on c.id = b.merchant_id;

CREATE VIEW bank.v_bank_user AS select
  a.*,
  b.name as level_name, b.income_money as level_income_money, b.referee_count as level_referee_count, b.value as level_value, b.disable_recommend as level_disable_recommend,
  c.name as merchant_name,
  ifnull((select current_value from bank_user_balance where user_id = a.id order by create_time desc limit 0, 1), 0) as balance,
  ifnull((select count(*) from bank_user where referee_id = a.id), 0) as referee_count,
  ifnull((select count(*) from bank_user_referee where referee_id = a.id), 0) as team_count,
  ifnull((select coalesce(sum(change_value),0) from bank_user_balance where user_id = a.id and change_value > 0), 0) as sum_income,
  ifnull((select coalesce(sum(change_value),0) from bank_user_balance where user_id = a.id and change_value > 0), 0) + a.add_income as view_sum_income,
  ifnull((select sum(money) from bank_cash_order where creator_id = a.id and status = 2),0) as cash_income,
  referee.*
from bank_user a
left join bank_user_level b on b.id = a.level_id
left join bank_merchant c on c.id = a.merchant_id
left join v__bank_user_referee referee on referee.current_id = a.id;

CREATE VIEW bank.v_bank_user_balance AS select
  a.*,
  b.card_id, c.loan_id, d.ticket_id,
  dps.name as ticket_source_name,
  ifnull(ifnull(ifnull(bu.name, cu.name), du.name), eu.name) as creator_name,
  ifnull(ifnull(ifnull(bu.mobile, cu.mobile), du.mobile), eu.mobile) as creator_mobile,
  ifnull(ifnull(ifnull(bu.mobile, cu.mobile), du.mobile), eu.mobile) as mobile,
  ifnull(ifnull(ifnull(b.creator_id, c.creator_id), d.creator_id), e.creator_id) as order_creator_id,
  ifnull(ifnull(ifnull(b.code, c.code), d.code), e.code) as order_code,
  ifnull(ifnull(ifnull(b.name, c.name), du.name), eu.name) as order_name,
  ifnull(ifnull(ifnull(b.mobile, c.mobile), du.mobile), eu.mobile) as order_mobile,
  ifnull(ifnull(ifnull(bp.name, cp.name), dp.name), if(e.id , concat(efrom.name, '升级', eto.name), null)) as name,
  f.name as lower_name
from bank_user_balance a
left join bank_product_card_order b on b.id = a.card_order_id
left join bank_user bu on bu.id = b.creator_id
left join bank_product_card bp on bp.id = b.card_id
left join bank_product_loan_order c on c.id = a.loan_order_id
left join bank_user cu on cu.id = c.creator_id
left join bank_product_loan cp on cp.id = c.loan_id
left join bank_product_ticket_order d on d.id = a.ticket_order_id
left join bank_user du on du.id = d.creator_id
left join bank_product_ticket dp on dp.id = d.ticket_id
left join bank_product_ticket_source dps on dps.id = dp.source_id
left join bank_user_level_order e on e.id = a.level_order_id
left join bank_user eu on eu.id = e.creator_id
left join bank_user_level eto on eto.id = e.to_level_id
left join bank_user_level efrom on efrom.id = e.from_level_id
left join bank_user f on f.id = a.lower_id;

CREATE VIEW bank.v_bank_user_bank_card AS select
  a.*, a.creator_id as user_id,
  b.name AS bank_name, b.icon as bank_icon, b.start_color as bank_start_color, b.end_color as bank_end_color
from bank_user_bank_card a
left join bank_bank b on b.id = a.bank_id;

CREATE VIEW bank.v_bank_user_level_card AS select a.*, b.money, b.card_id
from bank_user a
left join bank_user_level_x_product_card b on b.level_id = a.level_id;

CREATE VIEW bank.v_bank_user_level_card_source AS select a.*, b.money, b.source_id
from bank_user a
left join bank_user_level_x_product_card_source b on b.level_id = a.level_id;

CREATE VIEW bank.v_bank_user_level_loan AS select a.*, b.money, b.percent, b.loan_id
from bank_user a
left join bank_user_level_x_product_loan b on b.level_id = a.level_id;

CREATE VIEW bank.v_bank_user_level_order AS select
  a.*, date_format(a.create_time, '%Y-%m') stage_time,
  b.name as creator_name, b.mobile as creator_mobile, b.merchant_id,
  c.name as from_level_name, c.award_card_count as from_level_award_card_count,
  d.name as to_level_name, d.award_card_count as to_level_award_card_count,
  e.name as merchant_name,
  f.name as payment_name, f.description as payment_description,
  (select sum(money) from bank_user_level_income where order_id = a.id) as user_income
from bank_user_level_order a
left join bank_user b on a.creator_id = b.id
left join bank_user_level c on a.from_level_id = c.id
left join bank_user_level d on a.to_level_id = d.id
left join bank_merchant e on e.id = b.merchant_id
left join bank_payment f on f.id = a.payment_id;

CREATE VIEW bank.v_bank_user_level_order_income AS select a.*, concat(a.order_id, ':', a.user_id) as id,
  b.status, b.code as order_code,
  c.name as order_name, c.mobile as order_mobile,
  d.head_image as lower_head_image, d.name as lower_name, e.name as lower_level_name,
  concat(f.name, '升级', g.name) as product_name,
  h.mobile as user_mobile
from bank_user_level_income a
left join bank_user_level_order b on b.id = a.order_id
left join bank_user c on c.id = b.creator_id
left join bank_user d on d.id = a.lower_id
left join bank_user_level e on e.id = d.level_id
left join bank_user_level f on f.id = b.from_level_id
left join bank_user_level g on g.id = b.to_level_id
left join bank_user h on h.id = a.user_id;

CREATE VIEW bank.v_bank_user_level_ticket AS select a.*, b.money, b.ticket_id
from bank_user a
left join bank_user_level_x_product_ticket b on b.level_id = a.level_id;

CREATE VIEW bank.v_bank_user_level_x_product_card AS select a.*, b.merchant_id
from bank_user_level_x_product_card a
left join bank_user_level b on b.id = a.level_id;

CREATE VIEW bank.v_bank_user_level_x_product_loan AS select a.*, b.merchant_id
from bank_user_level_x_product_loan a
left join bank_user_level b on b.id = a.level_id;

CREATE VIEW bank.v_bank_user_level_x_product_ticket AS select a.*, b.merchant_id, c.source_id
from bank_user_level_x_product_ticket a
left join bank_user_level b on b.id = a.level_id
left join bank_product_ticket c on c.id = a.ticket_id;

CREATE VIEW bank.v_bank_user_team AS select
  a.*, a.id as user_id,
  b.name as level_name, b.income_money as level_income_money, b.referee_count as level_referee_count, b.value as level_value, b.disable_recommend as level_disable_recommend,
  c.name as merchant_name,
  (select current_value from bank_user_balance where user_id = a.id order by create_time desc limit 0, 1) as balance,
  (select count(*) from bank_user where referee_id = a.id) as referee_count,
  (select count(*) from bank_user_referee where referee_id = a.id) as team_all_count,
  (select coalesce(sum(change_value),0) from bank_user_balance where user_id = a.id and change_value > 0) as sum_income,
  (select coalesce(sum(change_value),0) from bank_user_balance where user_id = a.id and change_value > 0) + a.add_income as view_sum_income,
  (select sum(money) from bank_cash_order where creator_id = a.id and status = 2) as cash_income,
  referee.*
from bank_user a
left join bank_user_level b on b.id = a.level_id
left join bank_merchant c on c.id = a.merchant_id
left join v__bank_user_referee referee on referee.current_id = a.id;

CREATE VIEW bank.v_bank_user_x_user_level AS select a.*,
  b.name as level_name
from bank_user_x_user_level a
left join bank_user_level b on b.id = a.level_id;

CREATE VIEW bank.v_m_bank_copy_library AS select a.*, b.merchant_id

from bank_copy_library a
join bank_merchant_x_copy_library b on b.copy_library_id = a.id;

CREATE VIEW bank.v_m_bank_course AS select a.*, b.merchant_id,
  c.code AS type_code
from bank_course a
join bank_merchant_x_course b on b.course_id = a.id
left join bank_course_type c on c.id = a.type_id;

CREATE VIEW bank.v_m_bank_merchant_extend AS select
  a.id, a.code, a.type_id,
  b.merchant_id, b.value
from bank_merchant_extend a
join bank_merchant_x_extend b on b.extend_id = a.id;

CREATE VIEW bank.v_m_bank_product_card AS select
  a.*, b.type_ids,b.type_code,
  c.href as merchant_href, c.apply_bg as merchant_apply_bg,
  (select max(x_a.money) from bank_user_level_x_product_card x_a left join bank_user_level x_b on x_b.id = x_a.level_id where x_b.merchant_id = e.merchant_id and x_a.card_id = a.id) as max_level_money,
  d.is_recommend as source_is_recommend, d.is_enabled as source_is_enabled,
  e.merchant_id,  e.money as merchant_money
from bank_product_card a
left join v__type_by_product_card b on b.card_id = a.id
left join bank_product_card_source d on d.id = a.source_id
join bank_merchant_x_product_card e on e.card_id = a.id
left join bank_merchant_x_product_card c on c.card_id = a.id and c.merchant_id = e.merchant_id;

CREATE VIEW bank.v_m_bank_product_card_source AS select
  a.*,
  c.merchant_id, c.money as merchant_money,
  (select max(x_a.money) from bank_user_level_x_product_card_source x_a left join bank_user_level x_b on x_b.id = x_a.level_id where x_b.merchant_id = c.merchant_id and x_a.source_id = a.id) as max_level_money
from bank_product_card_source a
join bank_merchant_x_product_card_source c on c.source_id = a.id;

CREATE VIEW bank.v_m_bank_product_loan AS select
  a.*, b.type_ids, b.type_code,
  c.merchant_id, c.money as merchant_money, c.href as merchant_href,
  (select max(x_a.money) from bank_user_level_x_product_loan x_a left join bank_user_level x_b on x_b.id = x_a.level_id where x_b.merchant_id = c.merchant_id and x_a.loan_id = a.id) as max_level_money
from bank_product_loan a
left join v__type_by_product_loan b on b.loan_id = a.id
join bank_merchant_x_product_loan c on c.loan_id = a.id;

CREATE VIEW bank.v_m_bank_product_ticket AS select
  a.*, b.name as source_name, b.icon as source_icon,
  c.merchant_id, c.money as merchant_money
from bank_product_ticket a
left join bank_product_ticket_source b on b.id = a.source_id
join bank_merchant_x_product_ticket c on c.ticket_id = a.id;

CREATE VIEW bank.v_m_bank_sms AS select
  a.id, a.code,
  b.merchant_id, b.pass_code, b.pass_config
from bank_sms a
join bank_merchant_x_sms b on b.sms_id = a.id;

CREATE VIEW bank.v_m_bank_stat_card_order_by_day AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m-%d') as create_time,
  sum(a.merchant_income) as merchant_income
from bank_product_card_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m-%d');

CREATE VIEW bank.v_m_bank_stat_card_order_by_month_x_p AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, c.source_id,
  date_format(a.create_time, '%Y-%m') as stage_time,
  sum(a.merchant_income) as merchant_income
from bank_product_card_order a
left join bank_user b on b.id = a.creator_id
left join bank_product_card c on c.id = a.card_id
where a.status = 2
group by b.merchant_id, c.source_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.v_m_bank_stat_card_order_by_month_x_product AS select x.*, y.name as source_name
from v_m_bank_stat_card_order_by_month_x_p x
left join bank_product_card_source y on y.id = x.source_id;

CREATE VIEW bank.v_m_bank_stat_level_order_by_day AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m-%d') as create_time,
  sum(a.merchant_income) as merchant_income
from bank_user_level_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m-%d');

CREATE VIEW bank.v_m_bank_stat_loan_order_by_day AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m-%d') as create_time,
  sum(a.merchant_income) as merchant_income
from bank_product_loan_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m-%d');

CREATE VIEW bank.v_m_bank_stat_loan_order_by_month_x_p AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, a.loan_id,
  date_format(a.create_time, '%Y-%m') as stage_time,
  sum(a.merchant_income) as merchant_income
from bank_product_loan_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, a.loan_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.v_m_bank_stat_loan_order_by_month_x_product AS select x.*, y.name as product_name
from v_m_bank_stat_loan_order_by_month_x_p x
left join bank_product_loan y on y.id = x.loan_id;

CREATE VIEW bank.v_m_bank_stat_ticket_order_by_day AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m-%d') as create_time,
  sum(a.merchant_income) as merchant_income
from bank_product_ticket_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m-%d');

CREATE VIEW bank.v_m_bank_stat_ticket_order_by_month_x_p AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, a.ticket_id,
  date_format(a.create_time, '%Y-%m') as stage_time,
  sum(a.merchant_income) as merchant_income
from bank_product_ticket_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, a.ticket_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.v_m_bank_stat_ticket_order_by_month_x_product AS select z.*, y.name as product_name
from v_m_bank_stat_ticket_order_by_month_x_p z
left join bank_product_ticket y on y.id = z.ticket_id;

CREATE VIEW bank.v_m_info AS select a.*, a.id as merchant_id
from bank_merchant a;

CREATE VIEW bank.v_my_team_user AS select
  a.*, b.referee_id user_id, b.value as referee_value,
  c.mobile as referee_0_mobile, c.name as referee_0_name,
  d.name as level_name, d.value as level_value,
  ifnull((select current_value from bank_user_balance where user_id = a.id order by create_time desc limit 0, 1), 0) as balance,
  ifnull((select coalesce(sum(change_value),0) from bank_user_balance where user_id = a.id and change_value > 0), 0) as sum_income,
  (select count(*) from bank_user_referee where referee_id = b.user_id and value = 0) as referee_count
from bank_user_referee b
left join bank_user a on a.id = b.user_id
left join bank_user c on c.id = a.referee_id
left join bank_user_level d on d.id = a.level_id;

CREATE VIEW bank.vs_bank_stat_card_order_by_merchant$month AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time,
  coalesce(sum(a.merchant_income), 0) as merchant_income,
  coalesce(sum(a.platform_income), 0) as platform_income,
  coalesce(sum(a.user_income), 0) as user_income
from v_bank_product_card_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.vs_bank_stat_card_order_by_merchant$month$source AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time, c.source_id,
  coalesce(sum(a.merchant_income), 0) as merchant_income,
  coalesce(sum(a.platform_income), 0) as platform_income,
  coalesce(sum(a.user_income), 0) as user_income
from v_bank_product_card_order a
left join bank_user b on b.id = a.creator_id
left join bank_product_card c on c.id = a.card_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m'), c.source_id;

CREATE VIEW bank.vs_bank_stat_cash_order_by_merchant$month AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time,
  coalesce(sum(a.money), 0) as money
from v_bank_cash_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.vs_bank_stat_level_order_by_merchant$month AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time,
  coalesce(sum(a.merchant_income), 0) as merchant_income,
  coalesce(sum(a.platform_income), 0) as platform_income,
  coalesce(sum(a.user_income), 0) as user_income
from v_bank_user_level_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.vs_bank_stat_loan_order_by_merchant$month AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time,
  coalesce(sum(a.merchant_income), 0) as merchant_income,
  coalesce(sum(a.platform_income), 0) as platform_income,
  coalesce(sum(a.user_income), 0) as user_income
from v_bank_product_loan_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.vs_bank_stat_loan_order_by_merchant$month$product AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time, a.loan_id,
  coalesce(sum(a.merchant_income), 0) as merchant_income,
  coalesce(sum(a.platform_income), 0) as platform_income,
  coalesce(sum(a.user_income), 0) as user_income
from v_bank_product_loan_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m'), a.loan_id;

CREATE VIEW bank.vs_bank_stat_ticket_order_by_merchant$month AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time,
  coalesce(sum(a.merchant_income), 0) as merchant_income,
  coalesce(sum(a.platform_income), 0) as platform_income,
  coalesce(sum(a.user_income), 0) as user_income
from v_bank_product_ticket_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m');

CREATE VIEW bank.vs_bank_stat_ticket_order_by_merchant$month$product AS select
  concat(min(a.id), ':', max(a.id)) as id,
  b.merchant_id, date_format(a.create_time, '%Y-%m') stage_time, a.ticket_id,
  coalesce(sum(a.merchant_income), 0) as merchant_income,
  coalesce(sum(a.platform_income), 0) as platform_income,
  coalesce(sum(a.user_income), 0) as user_income
from v_bank_product_ticket_order a
left join bank_user b on b.id = a.creator_id
where a.status = 2
group by b.merchant_id, date_format(a.create_time, '%Y-%m'), a.ticket_id;

ALTER TABLE bank.bank_article ADD CONSTRAINT fk_bank_article_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_article ADD CONSTRAINT fk_bank_article FOREIGN KEY ( type_id ) REFERENCES bank.bank_article_type( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_article_type ADD CONSTRAINT fk_bank_article_type_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_copy_library ADD CONSTRAINT fk_bank_copy_library_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_course ADD CONSTRAINT fk_bank_knowledge_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_course ADD CONSTRAINT fk_bank_knowledge FOREIGN KEY ( type_id ) REFERENCES bank.bank_course_type( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant ADD CONSTRAINT fk_bank_merchant_bank_bindcard FOREIGN KEY ( bindcard_id ) REFERENCES bank.bank_bindcard( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_article ADD CONSTRAINT fk_bank_merchant_article FOREIGN KEY ( type_id ) REFERENCES bank.bank_merchant_article_type( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_article ADD CONSTRAINT fk_bank_merchant_article_1 FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_bill ADD CONSTRAINT fk_bank_merchant_bill FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_bill ADD CONSTRAINT fk_bank_merchant_bill_1 FOREIGN KEY ( type_id ) REFERENCES bank.bank_merchant_bill_type( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_notice ADD CONSTRAINT fk_bank_merchant_notice FOREIGN KEY ( type_id ) REFERENCES bank.bank_merchant_notice_type( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_copy_library ADD CONSTRAINT fk_bank_merchant_x_copy_library FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_copy_library ADD CONSTRAINT fk_bank_merchant_x_copy_library_1 FOREIGN KEY ( copy_library_id ) REFERENCES bank.bank_copy_library( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_course ADD CONSTRAINT fk_bank_merchant_x_course FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_course ADD CONSTRAINT fk_bank_merchant_x_course_1 FOREIGN KEY ( course_id ) REFERENCES bank.bank_course( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_extend ADD CONSTRAINT fk_bank_merchant_x_extend FOREIGN KEY ( extend_id ) REFERENCES bank.bank_merchant_extend( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_extend ADD CONSTRAINT fk_bank_merchant_x_extend_1 FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_card ADD CONSTRAINT fk_bank_merchant_x_product_card FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_card ADD CONSTRAINT fk_bank_merchant_x_product_card_1 FOREIGN KEY ( card_id ) REFERENCES bank.bank_product_card( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_card_source ADD CONSTRAINT fk_bank_merchant_x_product_card_source FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_card_source ADD CONSTRAINT fk_bank_merchant_x_product_card_source_1 FOREIGN KEY ( source_id ) REFERENCES bank.bank_product_card_source( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_loan ADD CONSTRAINT fk_bank_merchant_x_product_loan FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_loan ADD CONSTRAINT fk_bank_merchant_x_product_loan_1 FOREIGN KEY ( loan_id ) REFERENCES bank.bank_product_loan( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_ticket ADD CONSTRAINT fk_bank_merchant_x_product_ticket FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_product_ticket ADD CONSTRAINT fk_bank_merchant_x_product_ticket_1 FOREIGN KEY ( ticket_id ) REFERENCES bank.bank_product_ticket( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_sms ADD CONSTRAINT fk_bank_merchant_x_sms FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_merchant_x_sms ADD CONSTRAINT fk_bank_merchant_x_sms_1 FOREIGN KEY ( sms_id ) REFERENCES bank.bank_sms( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_news ADD CONSTRAINT fk_bank_news_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card ADD CONSTRAINT fk_bank_product_card_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card ADD CONSTRAINT fk_bank_product_card FOREIGN KEY ( source_id ) REFERENCES bank.bank_product_card_source( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_income ADD CONSTRAINT fk_bank_product_card_income FOREIGN KEY ( user_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_income ADD CONSTRAINT fk_bank_product_card_income_1 FOREIGN KEY ( order_id ) REFERENCES bank.bank_product_card_order( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_income ADD CONSTRAINT fk_bank_product_card_income_2 FOREIGN KEY ( lower_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_order ADD CONSTRAINT fk_bank_product_card_order FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_order ADD CONSTRAINT fk_bank_product_card_order_1 FOREIGN KEY ( card_id ) REFERENCES bank.bank_product_card( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_type ADD CONSTRAINT fk_bank_product_card_type FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_x_property ADD CONSTRAINT fk_bank_product_card_x_property FOREIGN KEY ( card_id ) REFERENCES bank.bank_product_card( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_x_property ADD CONSTRAINT fk_bank_product_card_x_property_1 FOREIGN KEY ( property_id ) REFERENCES bank.bank_product_card_property( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_x_type ADD CONSTRAINT fk_bank_product_card_x_type FOREIGN KEY ( card_id ) REFERENCES bank.bank_product_card( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_card_x_type ADD CONSTRAINT fk_bank_product_card_x_type_1 FOREIGN KEY ( type_id ) REFERENCES bank.bank_product_card_type( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan ADD CONSTRAINT fk_bank_product_loan_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_income ADD CONSTRAINT fk_bank_product_loan_income FOREIGN KEY ( user_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_income ADD CONSTRAINT fk_bank_product_loan_income_1 FOREIGN KEY ( order_id ) REFERENCES bank.bank_product_loan_order( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_income ADD CONSTRAINT fk_bank_product_loan_income_2 FOREIGN KEY ( lower_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_order ADD CONSTRAINT fk_bank_product_loan_order FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_order ADD CONSTRAINT fk_bank_product_loan_order_1 FOREIGN KEY ( loan_id ) REFERENCES bank.bank_product_loan( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_type ADD CONSTRAINT fk_bank_product_loan_type FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_x_property ADD CONSTRAINT fk_bank_product_loan_x_property FOREIGN KEY ( property_id ) REFERENCES bank.bank_product_loan_property( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_x_property ADD CONSTRAINT fk_bank_product_loan_x_property_2 FOREIGN KEY ( loan_id ) REFERENCES bank.bank_product_loan( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_x_type ADD CONSTRAINT fk_bank_product_loan_x_type FOREIGN KEY ( loan_id ) REFERENCES bank.bank_product_loan( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_loan_x_type ADD CONSTRAINT fk_bank_product_loan_x_type_1 FOREIGN KEY ( type_id ) REFERENCES bank.bank_product_loan_type( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket ADD CONSTRAINT fk_bank_product_ticket FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket ADD CONSTRAINT fk_bank_product_ticket_1 FOREIGN KEY ( source_id ) REFERENCES bank.bank_product_ticket_source( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket ADD CONSTRAINT fk_bank_product_ticket_2 FOREIGN KEY ( process_id ) REFERENCES bank.bank_product_ticket_process( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_income ADD CONSTRAINT fk_bank_product_ticket_income FOREIGN KEY ( user_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_income ADD CONSTRAINT fk_bank_product_ticket_income_1 FOREIGN KEY ( order_id ) REFERENCES bank.bank_product_ticket_order( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_income ADD CONSTRAINT fk_bank_product_ticket_income_2 FOREIGN KEY ( lower_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_order ADD CONSTRAINT fk_bank_product_ticket_order_1 FOREIGN KEY ( ticket_id ) REFERENCES bank.bank_product_ticket( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_order ADD CONSTRAINT fk_bank_product_ticket_order FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_source_x_property ADD CONSTRAINT fk_bank_product_ticket_source_x_property FOREIGN KEY ( source_id ) REFERENCES bank.bank_product_ticket_source( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_source_x_property ADD CONSTRAINT fk_bank_product_ticket_source_x_property_1 FOREIGN KEY ( property_id ) REFERENCES bank.bank_product_ticket_source_property( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_x_property ADD CONSTRAINT fk_bank_product_ticket_x_property FOREIGN KEY ( property_id ) REFERENCES bank.bank_product_ticket_property( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_product_ticket_x_property ADD CONSTRAINT fk_bank_product_ticket_x_property_1 FOREIGN KEY ( ticket_id ) REFERENCES bank.bank_product_ticket( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_qr_spread ADD CONSTRAINT fk_bank_qr_spread_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user ADD CONSTRAINT fk_bank_user_bank_merchant FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user ADD CONSTRAINT fk_bank_user_bank_user FOREIGN KEY ( referee_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user ADD CONSTRAINT fk_bank_user_bank_user_level FOREIGN KEY ( level_id ) REFERENCES bank.bank_user_level( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user ADD CONSTRAINT fk_bank_user_bank_user_1 FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_balance ADD CONSTRAINT fk_bank_user_balance_bank_user FOREIGN KEY ( user_id ) REFERENCES bank.bank_user( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_balance ADD CONSTRAINT fk_bank_user_balance_1 FOREIGN KEY ( card_order_id ) REFERENCES bank.bank_product_card_order( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_balance ADD CONSTRAINT fk_bank_user_balance_2 FOREIGN KEY ( loan_order_id ) REFERENCES bank.bank_product_loan_order( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_balance ADD CONSTRAINT fk_bank_user_balance FOREIGN KEY ( ticket_order_id ) REFERENCES bank.bank_product_ticket_order( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_balance ADD CONSTRAINT fk_bank_user_balance_4 FOREIGN KEY ( level_order_id ) REFERENCES bank.bank_user_level_order( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_balance ADD CONSTRAINT fk_bank_user_balance_5 FOREIGN KEY ( cash_order_id ) REFERENCES bank.bank_cash_order( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_balance ADD CONSTRAINT fk_bank_user_balance_bank_user_7 FOREIGN KEY ( lower_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_bank_card ADD CONSTRAINT fk_bank_user_bank_card FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_bank_card ADD CONSTRAINT fk_bank_user_bank_card_1 FOREIGN KEY ( bank_id ) REFERENCES bank.bank_bank( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level ADD CONSTRAINT fk_bank_user_level_bank_user FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level ADD CONSTRAINT fk_bank_user_level FOREIGN KEY ( merchant_id ) REFERENCES bank.bank_merchant( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_income ADD CONSTRAINT fk_bank_user_level_income FOREIGN KEY ( order_id ) REFERENCES bank.bank_user_level_order( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_income ADD CONSTRAINT fk_bank_user_level_income_1 FOREIGN KEY ( user_id ) REFERENCES bank.bank_user( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_income ADD CONSTRAINT fk_bank_user_level_income_2 FOREIGN KEY ( lower_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_order ADD CONSTRAINT fk_bank_user_level_order FOREIGN KEY ( creator_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_order ADD CONSTRAINT fk_bank_user_level_order_1 FOREIGN KEY ( from_level_id ) REFERENCES bank.bank_user_level( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_order ADD CONSTRAINT fk_bank_user_level_order_2 FOREIGN KEY ( to_level_id ) REFERENCES bank.bank_user_level( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_card ADD CONSTRAINT fk_bank_product_card_price FOREIGN KEY ( card_id ) REFERENCES bank.bank_product_card( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_card ADD CONSTRAINT fk_bank_product_card_x_price_x_level FOREIGN KEY ( level_id ) REFERENCES bank.bank_user_level( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_card_source ADD CONSTRAINT fk_bank_user_level_x_product_card_source FOREIGN KEY ( source_id ) REFERENCES bank.bank_product_card_source( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_card_source ADD CONSTRAINT fk_bank_user_level_x_product_card_source_1 FOREIGN KEY ( level_id ) REFERENCES bank.bank_user_level( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_loan ADD CONSTRAINT fk_bank_user_level_x_product_loan FOREIGN KEY ( level_id ) REFERENCES bank.bank_user_level( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_loan ADD CONSTRAINT fk_bank_user_level_x_product_loan_1 FOREIGN KEY ( loan_id ) REFERENCES bank.bank_product_loan( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_ticket ADD CONSTRAINT fk_bank_user_level_x_product_ticket FOREIGN KEY ( ticket_id ) REFERENCES bank.bank_product_ticket( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_level_x_product_ticket ADD CONSTRAINT fk_bank_user_level_x_product_ticket_1 FOREIGN KEY ( level_id ) REFERENCES bank.bank_user_level( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_referee ADD CONSTRAINT fk_bank_user_referee_bank_user FOREIGN KEY ( user_id ) REFERENCES bank.bank_user( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_referee ADD CONSTRAINT fk_bank_user_referee_bank_user_1 FOREIGN KEY ( referee_id ) REFERENCES bank.bank_user( id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE bank.bank_user_token ADD CONSTRAINT fk_bank_user_token_bank_user FOREIGN KEY ( user_id ) REFERENCES bank.bank_user( id ) ON DELETE CASCADE ON UPDATE NO ACTION;

