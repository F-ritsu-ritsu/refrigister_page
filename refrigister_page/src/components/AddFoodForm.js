import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";

const formatDateToISO8601 = (date) => {
  return new Date(date).toISOString().replace('Z', '+09:00');
};

const AddFoodForm = () => {
  let user_ID = 1;
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    tag: '',
    memo: '',
    expiration_date: null,
    image: null,
    user_id: user_ID,
    original_code: 0,
  });
  const imageInputRef = useRef(null); // Reference for the image input

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let submitValue = value;

    if (name === "quantity") {
      submitValue = parseFloat(submitValue);
    } else if (name === "image" && files) {
      submitValue = files[0];
    }

    setFormData({
      ...formData,
      [name]: submitValue,
    });
  };

  const handleImageCancel = () => {
    setFormData({
      ...formData,
      image: null,
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = ''; // Clear the file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (formData.image) {
        const imageData = new FormData();
        imageData.append('image', formData.image);

        const imageResponse = await fetch('http://takaryo1010.site:8080/images', {
          method: 'POST',
          body: imageData,
        });

        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          imageUrl = imageResult;
          console.log('imageUrl:', imageUrl);
        } else {
          alert('画像のアップロードに失敗しました');
          return;
        }
      }

      const formattedData = {
        expiration_date: formatDateToISO8601(formData.expiration_date),
        memo: formData.memo,
        name: formData.name,
        original_code: formData.original_code,
        quantity: formData.quantity,
        tag: formData.tag,
        user_id: formData.user_id,
        image_url: imageUrl,
      };
      console.log('formattedData:', formattedData);
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
          quantity: 0,
          tag: '',
          memo: '',
          expiration_date: null,
          image: null,
          user_id: user_ID,
          original_code: 0,
        });
        if (imageInputRef.current) {
          imageInputRef.current.value = ''; // Clear the file input after submission
        }
      } else {
        alert('食品の追加に失敗しました');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  return (
    <div>
      <Link to="/">一覧に戻る</Link>
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
          <label>賞味期限:</label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>画像ファイル:</label>
          <input
            type="file"
            name="image"
            ref={imageInputRef} // Reference for the image input
            onChange={handleChange}
          />
          {formData.image && (
            <button type="button" onClick={handleImageCancel}>画像を取り消し</button>
          )}
        </div>
        <button type="submit">追加</button>
      </form>
    </div>
  );
};

export default AddFoodForm;
