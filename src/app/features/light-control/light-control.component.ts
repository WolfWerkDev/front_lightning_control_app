import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EventSourcePolyfill } from 'event-source-polyfill';

// Definir interfaces para Producto y Luz
interface Luz {
  id: number;
  estadoLuz: boolean;
  nombreLuz: string;
  numeroLuz: number;
}

interface Producto {
  id: number;
  capacidadModulo: number;
  nombreModulo: string;
  luces: Luz[];
}

@Component({
  selector: 'app-light-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './light-control.component.html',
  styleUrls: ['./light-control.component.scss']
})
export class LightControlComponent implements OnInit, OnDestroy {
  productos: Producto[] = []; // Lista de productos
  selectedProduct: Producto | null = null; // Producto seleccionado para editar
  editModalVisible: boolean = false;
  controlModalVisible: boolean = false;
  token: string | null = sessionStorage.getItem('token'); // Token del usuario
  mensaje: string | null = "Aún no tienes productos registrados";
  eventSource: EventSource | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Recuperar los productos del sessionStorage
    const productos = sessionStorage.getItem('productos');
    if (productos) {
      try {
        console.log('Parseando productos...');
        this.productos = JSON.parse(productos);
      } catch (error) {
        console.error('Error al parsear los productos desde sessionStorage:', error);
      }
    } else {
      this.mensaje = "Aún no tienes productos registrados";
    }
  }

  openModal(producto: Producto): void {
    this.editModalVisible = true;
    console.log('Open modal');
    console.log(producto);
    this.selectedProduct = { ...producto };
  }
  openControlModal(producto: Producto): void {
    this.controlModalVisible = true;
    this.editModalVisible = false; // Asegura que solo esta modal se abre
    this.selectedProduct = { ...producto };
    console.log(producto);
  
    
    // Llamar al backend para obtener la información más reciente de las luces
    const endpoint = `http://localhost:8080/control/lights/${producto.id}`; // Ajustar la URL si es necesario
    const headers = { Authorization: `Bearer ${this.token}` };
  
    this.http.get<Luz[]>(endpoint, { headers }).subscribe(
      (lucesActualizadas) => {
        this.selectedProduct!.luces = lucesActualizadas; // Actualiza las luces en la modal
        //console.log('Luces actualizadas:', this.selectedProduct.luces);
      },
      (error) => {
        console.error('Error al obtener la información de las luces:', error);
        alert('Hubo un error al obtener la información de las luces.');
      }
    );

    this.actualizarLuces();
  }
  
  
  closeModal(): void {
    this.editModalVisible = false;
    console.log('Modal cerrado');
  }
  closeControlModal(): void {
    if (this.selectedProduct?.luces) {
        // Guardar el estado actual de las luces en sessionStorage
        sessionStorage.setItem("lucesActualizadas", JSON.stringify(this.selectedProduct.luces));
        console.log('lol');
    }

    this.controlModalVisible = false;
    console.log('Modal control cerrado');
}



  //Controla el estado de las luces
  toggleLuz(luz: Luz): void {
    if (!this.token) {
      console.error('No hay token disponible.');
      return;
    }
  
    const endpoint = 'http://localhost:8080/control/state';
    const headers = { Authorization: `Bearer ${this.token}` };
    const body = { id: luz.id, estado: !luz.estadoLuz }; // Invertir el estado antes de enviar
  
    this.http.put<Luz>(endpoint, body, { headers }).subscribe(
      () => {
        console.log(`Estado de la luz ${luz.id} cambiado. Actualizando lista...`);
        this.actualizarLuces(); // Llamar a la función para actualizar la lista de luces
      },
      (error) => {
        console.error('Error al cambiar el estado de la luz:', error);
        alert('Hubo un error al cambiar el estado de la luz.');
      }
    );
  }
  
// Método para consumir SSE
actualizarLuces(): void {
  if (!this.selectedProduct) return;

  const endpoint = `http://localhost:8080/control/${this.selectedProduct.id}/sse`;
  console.log("Id de producto seleccionado: " + this.selectedProduct.id);

  // Cerrar conexión SSE previa si existe
  if (this.eventSource) {
    this.eventSource.close();
  }

  // Crear nueva conexión SSE con headers
  this.eventSource = new EventSourcePolyfill(endpoint, {
    headers: { Authorization: `Bearer ${this.token}` }
  });

  this.eventSource.onmessage = (event) => {
    try {
      const lucesActualizadas: Luz[] = JSON.parse(event.data);

      // Ignorar keep-alive si el array está vacío
      if (lucesActualizadas.length === 0) return;

      this.selectedProduct!.luces = lucesActualizadas.sort((a, b) => a.numeroLuz - b.numeroLuz);
      sessionStorage.setItem(`lucesActualizadas`, JSON.stringify(lucesActualizadas));
      console.log("Luces actualizadas y guardadas en sessionStorage");
    } catch (error) {
      console.error('Error al procesar los datos SSE:', error);
    }
  };

  this.eventSource.onerror = (error) => {
    console.error('Error en la conexión SSE:', error);
    this.eventSource?.close();
  };
}

// Cerrar la conexión SSE al destruir el componente
ngOnDestroy() {
  this.eventSource?.close();
  console.log("SSE off");
}

//fin sse



  applyChanges(): void {
    if (!this.token || !this.selectedProduct) {
      console.error('No se pudo aplicar los cambios, no hay token o producto seleccionado.');
      return;
    }
  
    const updateEndpoint = `http://localhost:8080/product/update/${this.selectedProduct.id}`;
    const headers = { Authorization: `Bearer ${this.token}` };
  
    // 1️⃣ Actualizar el producto en el backend
    this.http.put<Producto>(updateEndpoint, this.selectedProduct, { headers }).pipe(
      catchError((error) => {
        console.error('Error al actualizar el producto:', error);
        alert('Hubo un error al actualizar el producto. Intenta de nuevo.');
        return throwError(error);
      })
    ).subscribe((productoActualizado) => {
      console.log('Producto actualizado:', productoActualizado);
  
      // 2️⃣ Buscar el producto en la lista y actualizarlo sin cambiar el orden
      const index = this.productos.findIndex(p => p.id === productoActualizado.id);
      if (index !== -1) {
        this.productos[index] = productoActualizado;
      }
  
      // 3️⃣ Ordenar las luces dentro del producto actualizado
      this.productos[index].luces.sort((a, b) => a.numeroLuz - b.numeroLuz);
  
      // 4️⃣ Cerrar el modal después de actualizar la información
      this.closeModal();
    });
  }
  

  goControl(luzId: number, productoId: number): void {
    this.router.navigate(['/control-luces', productoId]);
  }
  menuPrincipal(){
    this.router.navigate(['/dashboard']);
  }
}
