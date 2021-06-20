import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import ModuleDeclarations from './config/ModuleDeclarations';
import ModuleImports from './config/ModuleImports';

@NgModule({
  declarations: [...ModuleDeclarations],
  imports: [...ModuleImports],
  exports: [],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
