import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './List.css';

const List = () => {
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // Popup visibility
  const [selectedFood, setSelectedFood] = useState(null); // Selected food item for editing
  const [sortCriteria, setSortCriteria] = useState(''); // Sorting criteria
  const tagOrder = ['野菜', '肉', '魚', '乳製品', '調味料', '卵', '飲料', '果物', '加工食品', 'その他'];

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch('http://takaryo1010.site:8080/foods/1');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format image URL
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const imageName = imagePath.replace(/^images\//, '');  // Remove 'images/' prefix
    return `http://takaryo1010.site:8080/images/${imageName}`;
  };

  // Handle delete item
  const handleDelete = async (foodID) => {
    try {
      const response = await fetch(`http://takaryo1010.site:8080/foods/${foodID}`, {
        method: 'DELETE',
        headers: { 'accept': 'application/json' },
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== foodID));
      } else {
        console.error('削除に失敗しました');
        alert("食品の削除に失敗しました");
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  // Open the popup for editing an item
  const handleEdit = (food) => {
    setSelectedFood(food);
    setShowPopup(true);
  };

  // Close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFood(null);
  };

  // Handle save and reload list after editing
  const handleSave = () => {
    fetchData(); // Reload list after saving/editing
    handleClosePopup();
  };

  // Sort items based on selected criteria
  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  // Sort the items based on the selected criteria
  const sortedItems = [...items].sort((a, b) => {
    if (sortCriteria === 'tag') {
      // タグの順番をtagOrderに従って比較
      const indexA = tagOrder.indexOf(a.tag);
      const indexB = tagOrder.indexOf(b.tag);
      return indexA - indexB;
    } else if (sortCriteria === 'expiration_date') {
      // 賞味期限でソート
      return new Date(a.expiration_date) - new Date(b.expiration_date);
    }
    return 0;
  });

  return (
    <div>
      <h1>冷蔵庫の中身</h1>
      <Link to="/AddFood">新しく食品を追加</Link>
      <div>
        <button onClick={() => handleSort('tag')}>タグでソート</button>
        <button onClick={() => handleSort('expiration_date')}>賞味期限でソート</button>
      </div>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>画像</th>
            <th>名前</th>
            <th>メモ</th>
            <th>数量</th>
            <th>タグ</th>
            <th>作成日</th>
            <th>賞味期限</th>
            <th>編集</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(item => (
            <tr key={item.id}>
              <td>
                <img
                  src={formatImageUrl(item.image_url)}
                  alt={item.name}
                  width="100"
                />
              </td>
              <td>{item.name}</td>
              <td>{item.memo}</td>
              <td>{item.quantity}</td>
              <td>{item.tag}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>{new Date(item.expiration_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(item)}>編集</button>
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)}>✖️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup for editing food */}
      {showPopup && selectedFood && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>食品を編集</h2>
            <EditFoodForm 
              food={selectedFood} 
              onClose={handleClosePopup}
              onSave={handleSave} // Pass handleSave to reload list after save
            />
          </div>
        </div>
      )}
    </div>
  );
};

// EditFoodForm Component
const EditFoodForm = ({ food, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...food });
  const [selectedImage, setSelectedImage] = useState(null);
  const imageInputRef = useRef(null); // Reference for the image input
  
  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let submitValue = value;

    if (name === "quantity") {
      submitValue = parseFloat(submitValue);
    } else if (name === "image" && files) {
      submitValue = files[0];
      setSelectedImage(submitValue);  // Update selected image
    }

    setFormData({
      ...formData,
      [name]: submitValue,
    });
  };

  // Cancel image selection
  const handleImageCancel = () => {
    setSelectedImage(null); // Reset the selected image
    if (imageInputRef.current) {
      imageInputRef.current.value = ''; // Clear the file input
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.expiration_date = new Date(formData.expiration_date).toISOString();
    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      console.log('selectedImage:', selectedImage);
      if (selectedImage) {
        const imageData = new FormData();
        imageData.append('image', selectedImage);

        const imageResponse = await fetch('http://takaryo1010.site:8080/images', {
          method: 'POST',
          body: imageData,
        });

        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          imageUrl = imageResult;  // Assuming the response contains the URL of the uploaded image
          console.log('imageUrl:', imageUrl);
          formData.image_url = imageUrl;
          setSelectedImage(null); // Reset selected image
        } else {
          alert('画像のアップロードに失敗しました');
          return;
        }
      }
      console.log('formData:', formData);

      // Send updated food data to server
      const response = await fetch(`http://takaryo1010.site:8080/foods/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('食品が正常に更新されました');
        onSave(); // Call onSave to reload the list
      } else {
        alert('食品の更新に失敗しました');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  return (
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
          value={formData.expiration_date.split('T')[0]} // Format for date input
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>画像:</label>
        {selectedImage ? (
          <>
            <p>選択された画像: {selectedImage.name}</p>
            <button type="button" onClick={handleImageCancel}>画像をキャンセル</button>
          </>
        ) : (
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            ref={imageInputRef}
          />
        )}
      </div>
      <div>
        <button type="submit">保存</button>
        <button type="button" onClick={onClose}>キャンセル</button>
      </div>
    </form>
  );
};

export default List;
