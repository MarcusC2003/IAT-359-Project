import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";

const colors = {
    screenBackground: "#E9E3D5",
    card: "#fff",
    primary: "#E0916C",
    textPrimary: "#5B3C2E",
    borderColor: "#d8d4ce",
    inputBackground: "#FAF8F6",
    deleteButton: '#E53935',
    white: '#ffffff',
};

export default function EditTaskScreen({ navigation, route }) {
    const taskToEdit = route.params?.task;
    const onSaveCallback = route.params?.onSave; 
    const isEditing = !!taskToEdit;
    
    const [fontsLoaded] = useFonts({ Fredoka: require("../assets/fonts/Fredoka.ttf") });

    const [taskText, setTaskText] = useState(taskToEdit?.text || '');
    
    const [taskCategory, setTaskCategory] = useState(taskToEdit?.category || 'important');
    
    const [isProcessing, setIsProcessing] = useState(false);

    const categories = ['important', 'not_important', 'reminder'];
    
    const handleSave = async () => {
        if (!taskText.trim()) {
            Alert.alert('Error', 'Task description cannot be empty.');
            return;
        }

        if (!onSaveCallback) {
            Alert.alert('Error', 'Save function not found. Cannot save locally.');
            return;
        }

        Keyboard.dismiss();
        setIsProcessing(true);

        const updatedTask = {
            id: taskToEdit?.id,
            text: taskText,
            category: taskCategory,
            completed: taskToEdit?.completed || false,
            type: 'item' 
        };

        onSaveCallback(updatedTask);
        
        navigation.goBack();
    };
    
    const handleDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => {
                        if (taskToEdit) {
                            route.params?.onDelete(taskToEdit.id); 
                        }
                        navigation.goBack();
                    }
                },
            ]
        );
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" style={styles.loading} />;
    }

    const formatCategoryDisplay = (cat) => {
        if (cat === 'not_important') return 'Not Important';
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.screen}>
                <Text style={styles.pageTitle}>{isEditing ? 'Edit Task' : 'Add New Task'}</Text>

                <View style={styles.card}>
                    
                    <Text style={styles.label}>Task Description</Text>
                    <TextInput
                        style={styles.inputTitle}
                        placeholder="Go grocery shopping..."
                        placeholderTextColor={colors.textPrimary + '80'}
                        value={taskText}
                        onChangeText={setTaskText}
                        autoFocus={true}
                    />

                    <Text style={[styles.label, {marginTop: 15}]}>Priority</Text>
                    <View style={styles.categoryContainer}>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    taskCategory === cat ? styles.categoryButtonActive : null
                                ]}
                                onPress={() => setTaskCategory(cat)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    taskCategory === cat ? styles.categoryTextActive : null
                                ]}>
                                    {formatCategoryDisplay(cat)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={handleSave}
                        disabled={isProcessing}
                        activeOpacity={0.8}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.actionText}>{isEditing ? "Update Task" : "Add Task"}</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.screenBackground,
    },
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
        paddingTop: 8,
    },
    pageTitle: {
        fontFamily: "Fredoka",
        fontSize: 32,
        fontWeight: "900",
        color: colors.textPrimary,
        paddingHorizontal: 20,
        marginTop: 12,
        marginBottom: 10,
    },
    card: {
        marginTop: 12,
        marginHorizontal: 16,
        backgroundColor: colors.card,
        borderRadius: 36,
        paddingVertical: 28,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        flex: 1,
    },
    label: {
        fontFamily: "Fredoka",
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: '900',
        marginBottom: 8,
        paddingLeft: 5,
    },
    inputTitle: {
        fontFamily: "Fredoka",
        backgroundColor: colors.inputBackground,
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        marginBottom: 10,
        borderColor: colors.borderColor,
        borderWidth: 1,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    actionBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        marginTop: 15,
    },
    deleteBtn: {
        backgroundColor: colors.deleteButton,
        marginBottom: 5,
    },
    actionText: {
        color: colors.white,
        fontWeight: "900",
        fontSize: 18,
        fontFamily: "Fredoka",
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 30,
    },
    categoryButton: {
        backgroundColor: colors.inputBackground,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginRight: 10,
        marginBottom: 10,
    },
    categoryButtonActive: {
        backgroundColor: colors.primary, 
        borderColor: colors.primary,
    },
    categoryText: {
        fontFamily: "Fredoka",
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    categoryTextActive: {
        color: colors.white,
    }
});