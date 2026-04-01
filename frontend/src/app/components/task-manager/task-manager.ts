import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskApiService } from '../../services/task-api';
import { Task } from '../../services/task';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.css',
  encapsulation: ViewEncapsulation.None 
})
export class TaskManagerComponent implements OnInit {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  activeFilter: string = 'ALL';
  showForm: boolean = false;
  isEditing: boolean = false;
  editingId: number | null = null;

  newTask: Task = {
    title: '',
    description: '',
    status: 'TODO'
  };

  constructor(private taskApi: TaskApiService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskApi.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter(this.activeFilter);
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  applyFilter(filter: string): void {
    this.activeFilter = filter;
    if (filter === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(t => t.status === filter);
    }
  }

  openForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.newTask = { title: '', description: '', status: 'TODO' };
  }

  editTask(task: Task): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingId = task.id!;
    this.newTask = { ...task };
  }

  saveTask(): void {
    if (!this.newTask.title.trim()) return;

    if (this.isEditing && this.editingId) {
      this.taskApi.updateTask(this.editingId, this.newTask).subscribe({
        next: () => { this.loadTasks(); this.showForm = false; }
      });
    } else {
      this.taskApi.createTask(this.newTask).subscribe({
        next: () => { this.loadTasks(); this.showForm = false; }
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Delete karna hai?')) {
      this.taskApi.deleteTask(id).subscribe({
        next: () => this.loadTasks()
      });
    }
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'TODO': return 'badge-todo';
      case 'IN_PROGRESS': return 'badge-progress';
      case 'DONE': return 'badge-done';
      default: return '';
    }
  }
  getCount(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
  }
}