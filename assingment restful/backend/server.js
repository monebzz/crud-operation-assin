const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/task');

const app = express();
const PORT = 3000;

mongoose.set('strictQuery', false);
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/taskdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API');
});

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/tasks', async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    try {
        const newTask = new Task({ title, description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/api/tasks/:id', async (req, res) => {
    const { title, description, completed } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { title, description, completed }, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
