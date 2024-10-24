import React, { useState } from 'react';


const AddFoodForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    tag: '',
    memo: '',
    expiration_date: '',
    image_url: '',
    user_id: 1,
    original_code: 0,
  });

  // 入力変更時に呼ばれるハンドラー
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedData = {
      expiration_date: formData.expiration_date,
      image_url: formData.image_url,
      memo: formData.memo,
      name: formData.name,
      original_code: 12456456, // 固定値として設定
      quantity: formData.quantity,
      tag: formData.tag,
      user_id: 1, // 固定値として設定
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
  
      if (response.ok) {
        alert('食品が正常に追加されました');
        setFormData({
          name: '',
          quantity: '',
          tag: '',
          memo: '',
          expiration_date: '',
          image_url: '',
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
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
          />
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
          {/* <label>有効期限:</label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
            required
          /> */}
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