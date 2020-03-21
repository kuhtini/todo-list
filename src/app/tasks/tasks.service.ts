import { map, switchMap, take } from 'rxjs/operators';


import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AuthService } from '../auth';
import { ITask, Task } from './models';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


@Injectable()
export class TasksService {
  visibleTasks$: Observable<ITask[]>;

  private filter$: ReplaySubject<boolean> = new ReplaySubject(1);
  private filteredTasks$: Observable<ITask[]>;
  private tasksList$: AngularFireList<ITask>;
  private tasks$: Observable<ITask[]>;


  constructor(afDb: AngularFireDatabase, auth: AuthService) {
    auth.uid$.pipe(
      take(1))
      .subscribe(uid => {
        const path = `/tasks/${uid}`;

        this.tasksList$ = afDb.list<ITask>(path);
        this.tasks$ = this.tasksList$.valueChanges();
        this.tasks$.subscribe((tasks$ => console.log('tasks$', tasks$)));

        this.filteredTasks$ = this.filter$.pipe(
          switchMap(filterValue =>
            afDb.list<ITask>(path, (ref) => ref.orderByChild('completed').equalTo(filterValue))
              .snapshotChanges()
              .pipe(
                map(changes => this.getITasks(changes)
                )
              )
          )
        );
        this.visibleTasks$ = this.filter$.pipe(
          switchMap(filter => (filter === null ? this.tasks$ : this.filteredTasks$)));
      });
  }


  private getITasks(changes) {
    return changes.map(c => ({$key: c.payload.key, ...c.payload.val()} as ITask));
  }

  filterTasks(filter: string): void {
    switch (filter) {
      case 'false':
        this.filter$.next(false);
        break;

      case 'true':
        this.filter$.next(true);
        break;

      default:
        this.filter$.next(null);
        break;
    }
  }

  createTask(title: string): Promise<any> {
    return this.tasksList$.push(new Task(title));
  }

  removeTask(task: ITask): Promise<any> {
    return this.tasksList$.remove(task.$key);
  }

  updateTask(task: ITask, changes: Partial<ITask>): Promise<any> {
    return this.tasksList$.update(task.$key, changes);
  }
}
