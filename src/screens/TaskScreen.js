import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Platform,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

// --- Color Palette (Unchanged) ---
const colors = {
    background: '#f7f1eb',
    primary: '#E0916C', 
    textPrimary: '#5c3a2c',
    textSecondary: '#8a8a8a',
    white: '#fff', 
    checkboxBorder: '#e09a80',
    checkboxText: '#5c3a2c',
    completedText: 'rgba(92, 58, 44, 0.4)',
    deleteIcon: '#d16160ff',
};

// --- Initial Task Data (Priority categories) ---
const initialTasks = [
    { id: '1', text: "Complete color scheme", category: "important", completed: false },
    { id: '2', text: "Complete mock-up key frames", category: "important", completed: false },
    { id: '3', text: "Draft visual guideline", category: "not_important", completed: false },
    { id: '4', text: "Plan next steps", category: "important", completed: false },
    { id: '5', text: "Journal and try the best you can", category: "reminder", completed: false },
];

// --- Task Item Component (DATE DISPLAY REMOVED) ---
const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
    const checkboxSource = task.completed
        ? require('../assets/icons/checklist-icon.png')
        : require('../assets/icons/check-icon.png');

    return (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => onToggle(task.id)}>
                <Image
                    source={checkboxSource}
                    style={styles.checkbox}
                />
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.taskTextWrapper}
                onPress={() => onEdit(task)}
            >
                <Text 
                    style={[
                        styles.taskText,
                        task.completed && styles.taskTextCompleted
                    ]}
                    numberOfLines={1}
                >
                    {task.text}
                </Text>
                {/* DATE DISPLAY HAS BEEN REMOVED */}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
        </View>
    );
};

// --- Main TaskScreen Component ---
export default function TaskScreen({ navigation }) {
    const [tasks, setTasks] = useState(initialTasks);
    const isFocused = useIsFocused();
    
    const updateTaskState = useCallback((updatedTask) => {
        if (!updatedTask.id) {
            const maxId = Math.max(...tasks.map(t => parseInt(t.id))) || 0;
            const newId = (maxId + 1).toString();
            setTasks(prevTasks => [...prevTasks, { ...updatedTask, id: newId }]);
            return;
        }

        setTasks(prevTasks =>
            prevTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    }, [tasks]); 

    const toggleTaskCompletion = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (taskId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)) 
                },
            ]
        );
    };

    const editTask = (task) => {
        navigation.navigate('EditTask', { 
            task: task,
            onSave: updateTaskState,
        }); 
    };
    
    const addTask = () => {
        navigation.navigate('EditTask', { 
            task: { category: 'important' }, 
            onSave: updateTaskState,
        });
    };

    // --- GROUPING LOGIC (Priority-Based) ---
    const getGroupedTasks = () => {
        const sections = [
            { title: "⭐ Important & Urgent", category: "important", data: [] },
            { title: "🔔 Other Tasks", category: "not_important", data: [] },
            { title: "💡 Just Reminder:", category: "reminder", data: [] },
        ];

        // Sort by completion status first (incomplete first), then distribute
        const sortedTasks = [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

        sortedTasks.forEach(task => {
            const category = task.category || 'important'; 
            
            const section = sections.find(s => s.category === category);
            if (section) {
                section.data.push(task);
            }
        });

        let flatListData = [];
        sections.forEach(section => {
            if (section.data.length > 0) {
                flatListData.push({ type: 'header', title: section.title, category: section.category, id: section.category });
                flatListData.push(...section.data.map(task => ({ ...task, type: 'item' })));
            }
        });
        
        return flatListData;
    };

    const flatListData = getGroupedTasks();

    const renderItem = ({ item }) => {
        if (item.type === 'header') {
            return (
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{item.title}</Text>
                </View>
            );
        }
        
        return (
            <TaskItem 
                task={item} 
                onToggle={toggleTaskCompletion} 
                onEdit={editTask}
                onDelete={deleteTask}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.mainHeader}>
                    <Text style={styles.appTitle}>Palananner</Text>
                    <Text style={styles.appDescription}>
                        The adhd friendly app that has your calendar, to dos, weather, notes
                        all in your custom room
                    </Text>
                </View>

                <FlatList
                    data={flatListData}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No tasks scheduled. Time to relax!</Text>
                    }
                />

                <TouchableOpacity
                    style={styles.fab}
                    onPress={addTask} 
                >
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    mainHeader: {
        paddingHorizontal: 25,
        paddingTop: Platform.OS === 'android' ? 20 : 20,
        paddingBottom: 20,
    },
    appTitle: {
        fontSize: 40,
        fontWeight: '900',
        color: colors.textPrimary,
        marginBottom: 5,
    },
    appDescription: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
        maxWidth: '90%',
    },
    flatListContent: {
        paddingHorizontal: 25,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 15,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    flagIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: '#3b2709ff',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    checkbox: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
        marginRight: 15,
        marginLeft: 10,
    },
    taskTextWrapper: {
        flex: 1,
        marginRight: 10,
    },
    taskText: {
        fontSize: 18,
        color: colors.checkboxText,
        fontWeight: '500',
    },
    taskTextCompleted: {
        textDecorationLine: 'line-through',
        color: colors.completedText,
    },
    deleteButton: {
        padding: 8,
        marginRight: 5,
    },
    deleteText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.deleteIcon,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: colors.primary,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#3a1f08ff',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    fabIcon: {
        fontSize: 30,
        color: 'white',
        lineHeight: 30,
    },
});