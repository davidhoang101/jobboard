<?php

/**
 * This is the model class for table "companies".
 *
 * The followings are the available columns in table 'companies':
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $description
 * @property integer $members
 * @property string $web_url
 * @property string $logo_url
 * @property string $address
 * @property integer $city_id
 * @property string $phone
 * @property string $fax
 * @property string $created_on
 */
class Companies extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'companies';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('members, city_id', 'numerical', 'integerOnly'=>true),
			array('name, email', 'length', 'max'=>100),
			array('password', 'length', 'max'=>32),
			array('web_url, logo_url, address', 'length', 'max'=>255),
			array('phone, fax', 'length', 'max'=>50),
			array('description, created_on', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, name, email, password, description, members, web_url, logo_url, address, city_id, phone, fax, created_on', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'name' => 'Name',
			'email' => 'Email',
			'password' => 'Password',
			'description' => 'Description',
			'members' => 'Members',
			'web_url' => 'Web Url',
			'logo_url' => 'Logo Url',
			'address' => 'Address',
			'city_id' => 'City',
			'phone' => 'Phone',
			'fax' => 'Fax',
			'created_on' => 'Created On',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id,true);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('password',$this->password,true);
		$criteria->compare('description',$this->description,true);
		$criteria->compare('members',$this->members);
		$criteria->compare('web_url',$this->web_url,true);
		$criteria->compare('logo_url',$this->logo_url,true);
		$criteria->compare('address',$this->address,true);
		$criteria->compare('city_id',$this->city_id);
		$criteria->compare('phone',$this->phone,true);
		$criteria->compare('fax',$this->fax,true);
		$criteria->compare('created_on',$this->created_on,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Companies the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
