import { switchMap, take } from 'rxjs/operators';


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
          switchMap(filterValue => {
            console.log('switchMap', filterValue);
            console.log('  afDb.database.ref(path).toString();',   afDb.database.ref(path).toString());
            return afDb.list<ITask>(path, (ref) => {
              return ref.orderByChild('completed').equalTo(filterValue);
            }).valueChanges();
          })
        );
        this.filteredTasks$.subscribe((tasks$ => console.log('filteredTasks$', tasks$)));

        this.visibleTasks$ = this.filter$.pipe(
          switchMap(filter => (filter === null ? this.tasks$ : this.filteredTasks$)));
      });
  }


  filterTasks(filter: string): void {
    console.log('filterTasks', filter);
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
