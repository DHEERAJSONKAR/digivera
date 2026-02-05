#!/bin/bash

# DIGIVERA - Project Launch Script
# Automatically starts both backend and frontend

echo "🚀 Starting DIGIVERA..."
echo ""

# Check if tmux is available
if command -v tmux &> /dev/null; then
    echo "Using tmux for split terminal..."
    
    # Create new tmux session
    tmux new-session -d -s digivera
    
    # Split window
    tmux split-window -h
    
    # Backend in left pane
    tmux select-pane -t 0
    tmux send-keys "cd server && echo '⚡ Starting Backend...' && npm run dev" C-m
    
    # Frontend in right pane
    tmux select-pane -t 1
    tmux send-keys "cd client && echo '⚡ Starting Frontend...' && npm run dev" C-m
    
    # Attach to session
    tmux attach-session -t digivera
    
else
    echo "⚠️  tmux not found. Please run manually:"
    echo ""
    echo "Terminal 1: cd server && npm run dev"
    echo "Terminal 2: cd client && npm run dev"
    echo ""
fi
