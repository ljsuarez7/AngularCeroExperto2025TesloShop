import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  pages = input<number>(0);
  currentPage = input<number>(1);

  //Esto lo hacemos para poder cambiar la pagina activa ya que el input no se puede manipular desde la propia clase
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({length: this.pages()}, (_, i) => i + 1);
  });

}
