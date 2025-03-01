import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

const InviteMemberByEmail = () => {
  const inviteMessages = ["Vui vẻ", "Trang trọng", "Lãng mạn", "Mặc định"];

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<
    { id: number; name: string; avatar: string }[]
  >([]);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const users: { id: number; name: string; avatar: string }[] = [
    { id: 1, name: "John Doe", avatar: "https://example.com/avatar1.png" },
    { id: 2, name: "Jane Smith", avatar: "https://example.com/avatar2.png" },
    // Add more users as needed
  ];

  const handleSearch = (text: string) => {
    setSearch(text);
    setSearchInitiated(true);
    if (text) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">Chọn người</Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>

      {/* Search Box */}
      <View className="mx-4 mt-3 flex-row items-center rounded-lg bg-white p-3">
        <AntDesign name="search1" size={20} color="gray" />
        <TextInput
          className="ml-2 flex-1 text-base"
          placeholder="Tìm kiếm..."
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <AntDesign name="close" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* Invite Messages */}
      <View className="mx-4 mt-3 rounded-lg bg-white p-3">
        <Text className="mb-2 text-sm font-semibold">Chọn lời mời vào quỹ</Text>
        <View className="flex-row flex-wrap">
          {inviteMessages.map((msg, index) => (
            <TouchableOpacity
              key={index}
              className="mb-2 mr-2 rounded-full bg-pink-100 px-3 py-1"
            >
              <Text className="font-semibold text-pink-600">{msg}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="mt-2 text-sm text-gray-600">
          Đặng Phan Gia Đức sẽ giận nếu bạn không đồng ý tham gia quỹ cùng. Tham
          gia ngay!
        </Text>
      </View>

      {/* Search Results */}
      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row items-center p-3">
              <Image
                source={{ uri: item.avatar }}
                className="h-10 w-10 rounded-full"
              />
              <Text className="ml-3 text-base">{item.name}</Text>
            </View>
          )}
        />
      ) : (
        searchInitiated && (
          <View className="mt-5 flex-1 items-center justify-center">
            <Image
              source={{ uri: "https://example.com/no-result.png" }}
              className="h-40 w-40"
            />
            <Text className="mt-2 text-lg text-gray-500">
              Không tìm thấy kết quả
            </Text>
          </View>
        )
      )}
    </SafeAreaViewCustom>
  );
};

export default InviteMemberByEmail;
