import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";

const List = () => {
    const [items, setItems] = useState([]);

    // APIからデータを取得する関数
    useEffect(() => {
    // 実際のAPIエンドポイントをここに入れてください
    const fetchData = async () => {
      try {
        const response = await fetch('http://takaryo1010.site:8080/foods/1');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchData();
    }, []);

  return (
    <div>
      <h1>冷蔵庫の中身</h1>
      <Link to="/AddFood">新しく食品を追加</Link>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>画像</th>
            <th>名前</th>
            <th>メモ</th>
            <th>数量</th>
            <th>タグ</th>
            <th>作成日</th>
            <th>有効期限</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <img src={item.image_url} alt={item.name} width="100" />
              </td>
              <td>{item.name}</td>
              <td>{item.memo}</td>
              <td>{item.quantity}</td>
              <td>{item.tag}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>{new Date(item.expiration_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;