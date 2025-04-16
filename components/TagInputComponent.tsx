import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TagInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  suggestedTags?: string[];
}

const TagInputComponent = ({
  value,
  onChangeText,
  placeholder = "Enter tags...",
  containerClass = "",
  labelClass = "",
  inputClass = "",
  suggestedTags = []
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Initialize tags array from value string (comma-separated)
  useEffect(() => {
    if (value) {
      const tagArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setTags(tagArray);
    } else {
      setTags([]);
    }
  }, [value]);

  // Handle adding a new tag
  const handleAddTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChangeText(newTags.join(', '));
      setInputValue('');
    }
  }, [tags, onChangeText]);

  // Handle removing a tag
  const handleRemoveTag = useCallback((indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChangeText(newTags.join(', '));
  }, [tags, onChangeText]);

  // Handle input submission (Enter key or comma)
  const handleInputSubmit = useCallback(() => {
    if (inputValue.includes(',')) {
      // Handle multiple tags separated by commas
      const newTagsArray = inputValue.split(',').map(tag => tag.trim()).filter(tag => tag);
      const uniqueNewTags = newTagsArray.filter(tag => !tags.includes(tag));
      
      if (uniqueNewTags.length > 0) {
        const updatedTags = [...tags, ...uniqueNewTags];
        setTags(updatedTags);
        onChangeText(updatedTags.join(', '));
      }
      setInputValue('');
    } else if (inputValue.trim()) {
      handleAddTag(inputValue);
    }
  }, [inputValue, tags, handleAddTag, onChangeText]);

  return (
    <View className={`mb-2 ${containerClass}`}>
      <View className="flex-row flex-wrap mb-2">
        {tags.map((tag, index) => (
          <View key={index} className="bg-gray-100 rounded-full px-3 py-1 flex-row items-center mr-2 mb-2">
            <Text className="text-gray-800 text-sm">{tag}</Text>
            <TouchableOpacity 
              onPress={() => handleRemoveTag(index)}
              className="ml-1"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <MaterialIcons name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View className="flex-row items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          onEndEditing={handleInputSubmit}
          placeholder={placeholder}
          className={`flex-1 p-2 text-sm ${inputClass}`}
          onSubmitEditing={handleInputSubmit}
        />
        {inputValue.trim() && (
          <TouchableOpacity 
            onPress={handleInputSubmit}
            className="p-2 bg-gray-100 mr-1 rounded-full"
          >
            <MaterialIcons name="add" size={20} color="#609084" />
          </TouchableOpacity>
        )}
      </View>

      {suggestedTags.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mt-2"
        >
          {suggestedTags.map((tag, index) => (
            !tags.includes(tag) && (
              <TouchableOpacity
                key={index}
                onPress={() => handleAddTag(tag)}
                className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mr-2"
              >
                <Text className="text-gray-700 text-xs">+ {tag}</Text>
              </TouchableOpacity>
            )
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TagInputComponent;