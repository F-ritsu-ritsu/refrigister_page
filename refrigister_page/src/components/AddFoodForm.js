import React, { useState } from 'react';
import Home from './Home';
import { Link } from "react-router-dom";

const formatDateToISO8601 = (date) => {
  return new Date(date).toISOString().replace('Z', '+09:00');
};


const AddFoodForm = () => {
  let user_ID=1;
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    tag: '',
    memo: '',
    expiration_date: null,
    image_url: '',
    user_id: user_ID,
    original_code: 0,
  });

  // 入力変更時に呼ばれるハンドラー
  const handleChange = (e) => {
    const { name, value } = e.target;
    let submitValue=value;
    if("quantity"===name){
      submitValue=parseFloat(submitValue);
    }
    setFormData({
      ...formData,
      [name]: submitValue,
    });
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedData = {
      expiration_date: formatDateToISO8601(formData.expiration_date),
      image_url: formData.image_url,
      memo: formData.memo,
      name: formData.name,
      original_code: formData.original_code, // 固定値として設定
      quantity: formData.quantity,
      tag: formData.tag,
      user_id: formData.user_id, // 固定値として設定
    };
  
    try {
      const response = await fetch('http://takaryo1010.site:8080/foods', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      console.log(formattedData)

  
      if (response.ok) {
        alert('食品が正常に追加されました');
        setFormData({
          name: '',
          quantity: 0,
          tag: '',
          memo: '',
          expiration_date: null,
          image_url: '',
          user_id: user_ID,
          original_code: 0,
        });
      } else {
        alert('食品の追加に失敗しました');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  return (
    <div>
      <Link to="/">一覧の戻る</Link>
      <h1>食品を追加する</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>食品名:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>数量:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
        <label>タグ:</label>
          <select
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            required
          >
            <option value="">タグを選択してください</option>
            <option value="野菜">野菜</option>
            <option value="肉">肉</option>
            <option value="魚">魚</option>
            <option value="乳製品">乳製品</option>
            <option value="調味料">調味料</option>
            <option value="卵">卵</option>
            <option value="飲料">飲料</option>
            <option value="果物">果物</option>
            <option value="加工食品">加工食品</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div>
          <label>メモ:</label>
          <textarea
            name="memo"
            value={formData.memo}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>有効期限:</label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>画像URL:</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <button type="submit">追加</button>
      </form>
    </div>
  );
};

export default AddFoodForm;